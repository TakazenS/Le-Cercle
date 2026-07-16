use axum::{ Json, extract::State, http::StatusCode };
use argon2::{ Argon2, PasswordHash, PasswordVerifier };
use tracing::{ info, warn };
use crate::models::RegisterRequest;

/*======= Functions =======*/
pub async fn handler() -> &'static str { "Le Cercle - Server Online !" }

pub async fn register(
    State(pool): State<sqlx::PgPool>,
    Json(payload): Json<RegisterRequest>,
) -> Result<String, (StatusCode, String)> {
    info!("Registration request for : {}", payload.email);

    let stored_hash: Option<String> =
        sqlx::query_scalar("SELECT access_code_hash FROM server_config WHERE id = 1")
            .fetch_optional(&pool)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB error : {e}")))?;

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

    info!("Registration accepted : access code valid for {}", payload.email);
    Ok(format!("Access code valid - welcome {}", payload.email))
}