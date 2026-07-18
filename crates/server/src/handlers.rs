use axum::{ Json, extract::State, http::StatusCode };
use argon2::{ Argon2, PasswordHash, PasswordVerifier };
use tracing::{ info, warn };
use uuid::Uuid;
use crate::auth::{ create_hash, generate_session_token };
use crate::models::{ RegisterRequest, LoginRequest, AuthResponse };

/*======= Helpers =======*/
fn internal_error(e: sqlx::Error) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
}

async fn create_session(pool: &sqlx::PgPool, user_id: Uuid) -> Result<String, (StatusCode, String)> {
    let token = generate_session_token();
    sqlx::query(
    "INSERT INTO sessions (token, user_id, expires_at)
         VALUES ($1, $2, now() + interval '90 days')",
    )
    .bind(&token)
    .bind(user_id)
    .execute(pool).await.map_err(internal_error)?;
    Ok(token)
}

/*======= Async Handlers =======*/
pub async fn register(
    State(pool): State<sqlx::PgPool>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, String)> {
    info!("Registration request for : {}", payload.email);
    
    let stored_hash: Option<String> =
        sqlx::query_scalar("SELECT access_code_hash FROM server_config WHERE id = 1")
            .fetch_optional(&pool)
            .await
            .map_err(internal_error)?;
    let stored_hash = stored_hash
        .ok_or((StatusCode::INTERNAL_SERVER_ERROR, "Server not initialized or not configured".to_string()))?;
    let parsed = PasswordHash::new(&stored_hash)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Invalid stored hash".to_string()))?;
    if Argon2::default()
        .verify_password(payload.access_code.as_bytes(), &parsed)
        .is_err()
    {
        warn!("Registration refused : invalid access code for {}", payload.email);
        return Err((StatusCode::FORBIDDEN, "Invalid access code !".to_string()));
    }

    let existing_account: Option<Uuid> = sqlx::query_scalar("SELECT id FROM users WHERE email = $1")
        .bind(&payload.email)
        .fetch_optional(&pool).await.map_err(internal_error)?;
    if existing_account.is_some() {
        return Err((StatusCode::CONFLICT, "Email already used !".to_string()));
    }
    
    let password_hash = create_hash(&payload.password);
    let mut tx = pool.begin().await.map_err(internal_error)?;
    
    let user_id: Uuid = sqlx::query_scalar(
        "INSERT INTO users (email, first_name, last_name, password_hash, nickname)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id",
    )
    .bind(&payload.email)
    .bind(&payload.first_name)
    .bind(&payload.last_name)
    .bind(password_hash)
    .bind(&payload.nickname)
    .fetch_one(&mut *tx).await.map_err(internal_error)?;
    
    let current_owner: Option<Uuid> = 
        sqlx::query_scalar("SELECT owner_id FROM server_config WHERE id = 1")
            .fetch_one(&mut *tx).await.map_err(internal_error)?;
    let is_first_user = current_owner.is_none();
    
    let role_id: Uuid = if is_first_user {
        sqlx::query_scalar("SELECT id FROM roles WHERE is_owner = TRUE LIMIT 1")
            .fetch_one(&mut *tx).await.map_err(internal_error)?
    } else {
        sqlx::query_scalar("SELECT id FROM roles WHERE is_default = TRUE LIMIT 1")
            .fetch_one(&mut *tx).await.map_err(internal_error)?
    };
    
    sqlx::query("INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)")
        .bind(user_id)
        .bind(role_id)
        .execute(&mut *tx).await.map_err(internal_error)?;
    
    if is_first_user {
        sqlx::query("UPDATE server_config SET owner_id = $1 WHERE id = 1")
            .bind(user_id)
            .execute(&mut *tx).await.map_err(internal_error)?;
    }

    tx.commit().await.map_err(internal_error)?;

    info!("Registration accepted : access code valid for {}", payload.email);
    let token = create_session(&pool, user_id).await?;
    info!("Creating session for : {} ({})", payload.email, payload.nickname);
    Ok(Json(AuthResponse { token }))
}

pub async fn login(
    State(pool): State<sqlx::PgPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, String)> {
    info!("Login request for : {}", payload.email);

    let user: Option<(Uuid, String)> = sqlx::query_as("SELECT id, password_hash FROM users WHERE email = $1")
        .bind(&payload.email)
        .fetch_optional(&pool).await.map_err(internal_error)?;

    let (user_id, password_hash) = match user {
        Some(u) => u,
        None => {
            warn!("Login failed : unknown email {}", payload.email);
            return Err((StatusCode::UNAUTHORIZED, "Invalid credentials !".to_string()));
        }
    };

    let parsed = PasswordHash::new(&password_hash)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Invalid stored hash".to_string()))?;
    if Argon2::default()
        .verify_password(payload.password.as_bytes(), &parsed)
        .is_err()
    {
        warn!("Login failed : wrong password for {}", payload.email);
        return Err((StatusCode::UNAUTHORIZED, "Invalid credentials !".to_string()));
    }

    let token = create_session(&pool, user_id).await?;
    info!("Login success for {}", payload.email);
    Ok(Json(AuthResponse { token }))
}

pub async fn handler() -> &'static str { "Le Cercle - Server Online !" }
