use axum::{ Json, extract::State, http::StatusCode };
use argon2::{ Argon2, PasswordHash, PasswordVerifier };
use tracing::{ info, warn };
use uuid::Uuid;
use crate::auth::create_hash;
use crate::models::RegisterRequest;

/*======= Sync Functions =======*/
fn internal_error(e: sqlx::Error) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
}

/*======= Async Functions =======*/
pub async fn register(
    State(pool): State<sqlx::PgPool>,
    Json(payload): Json<RegisterRequest>,
) -> Result<String, (StatusCode, String)> {
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
        return Err((StatusCode::FORBIDDEN, "Invalid access code".to_string()));
    }

    let existing_account: Option<Uuid> = sqlx::query_scalar("SELECT id FROM users WHERE email = $1")
        .bind(&payload.email)
        .fetch_optional(&pool).await.map_err(internal_error)?;
    if existing_account.is_some() {
        return Err((StatusCode::CONFLICT, "Email already exists".to_string()));
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
    Ok(format!("Access code valid - welcome {}", payload.email))
}

pub async fn login() {
    //
}

pub async fn handler() -> &'static str { "Le Cercle - Server Online !" }
