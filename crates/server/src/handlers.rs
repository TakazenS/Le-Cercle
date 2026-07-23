use axum::{ Json, extract::State, http::StatusCode };
use argon2::{ Argon2, PasswordHash, PasswordVerifier };
use tracing::{ info, warn, error };
use uuid::Uuid;
use crate::auth::{ create_hash, generate_session_token };
use crate::middlewares::AuthUser;
use crate::models::{RegisterRequest, LoginRequest, AuthResponse, MeResponse };
use crate::validation::{ PATTERNS, is_strong_password };

/*======= Helpers =======*/
fn internal_error(e: sqlx::Error) -> (StatusCode, String) {
    error!("Database error : {e}");
    (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error".to_string())
}

pub async fn handler() -> &'static str { "Le Cercle - Server Online !" }

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

    let first_name = payload.first_name.trim();
    let last_name = payload.last_name.trim();
    let email = &payload.email.trim().to_lowercase();
    let nickname = &payload.nickname.trim();
    let pseudo = payload.pseudo.trim();
    let password = &payload.password;
    let access_code = payload.access_code.trim().to_uppercase();
    
    if !PATTERNS.name.is_match(first_name) {
        warn!("Registration refused : invalid first name for {}", email);
        return Err((StatusCode::BAD_REQUEST, "Invalid first name !".to_string()));
    }
    if !PATTERNS.name.is_match(last_name) {
        warn!("Registration refused : invalid last name for {}", email);
        return Err((StatusCode::BAD_REQUEST, "Invalid last name !".to_string()));
    }
    if !PATTERNS.email.is_match(&email) || email.chars().count() > 128 {
        warn!("Registration refused : invalid email for {}", email);
        return Err((StatusCode::BAD_REQUEST, "Invalid email !".to_string()));
    }
    if !PATTERNS.pseuname.is_match(nickname) {
        warn!("Registration refused : invalid nickname for {}", email);
        return Err((StatusCode::BAD_REQUEST, "Invalid nickname !".to_string()));
    }
    if !PATTERNS.pseuname.is_match(pseudo) {
        warn!("Registration refused : invalid pseudo for {}", email);
        return Err((StatusCode::BAD_REQUEST, "Invalid pseudo !".to_string()));
    }
    if !is_strong_password(password) {
        warn!("Registration refused : weak password for {}", email);
        return Err((StatusCode::BAD_REQUEST, "Invalid password !".to_string()));
    }
    if !PATTERNS.access_code.is_match(&access_code) {
        warn!("Registration refused : invalid access code for {}", email);
        return Err((StatusCode::BAD_REQUEST, "Invalid access code !".to_string()));
    }
    
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
        .verify_password(access_code.as_bytes(), &parsed)
        .is_err()
    {
        warn!("Registration refused : invalid access code for {}", email);
        return Err((StatusCode::FORBIDDEN, "Invalid access code !".to_string()));
    }

    let existing_email: Option<Uuid> = sqlx::query_scalar("SELECT id FROM users WHERE email = $1")
        .bind(email)
        .fetch_optional(&pool).await.map_err(internal_error)?;
    if existing_email.is_some() {
        warn!("Registration refused : email already used for {}", email);
        return Err((StatusCode::CONFLICT, "Email already used !".to_string()));
    }

    let existing_nickname: Option<Uuid> = sqlx::query_scalar("SELECT id FROM users WHERE nickname = $1")
        .bind(nickname)
        .fetch_optional(&pool).await.map_err(internal_error)?;
    if existing_nickname.is_some() {
        warn!("Registration refused : nickname already used for {}", nickname);
        return Err((StatusCode::CONFLICT, "Nickname already used !".to_string()));
    }
    
    let password_hash = create_hash(password);
    let mut tx = pool.begin().await.map_err(internal_error)?;
    
    let user_id: Uuid = sqlx::query_scalar(
        "INSERT INTO users (email, first_name, last_name, password_hash, nickname, pseudo)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id",
    )
    .bind(email)
    .bind(first_name)
    .bind(last_name)
    .bind(password_hash)
    .bind(nickname)
    .bind(pseudo)
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

    info!("Registration accepted : access code valid for {}", email);
    let token = create_session(&pool, user_id).await?;
    info!("Creating session for : {} ({})", email, nickname);
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

pub async fn me(
    user: AuthUser,
    State(pool): State<sqlx::PgPool>,
) -> Result<Json<MeResponse>, (StatusCode, String)> {
    let row: (String, String, String, String, Option<String>) = sqlx::query_as(
        "SELECT email, first_name, last_name, nickname, description FROM users WHERE id = $1",
    )
    .bind(user.user_id)
    .fetch_one(&pool)
    .await
    .map_err(internal_error)?;

    Ok(Json(MeResponse {
        email: row.0,
        first_name: row.1,
        last_name: row.2,
        nickname: row.3,
        description: row.4,
    }))
}
