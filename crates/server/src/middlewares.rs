use axum::extract::{ FromRef, FromRequestParts };
use axum::http::StatusCode;
use axum::http::request::Parts;
use sqlx::PgPool;
use uuid::Uuid;

pub struct AuthUser {
    pub user_id: Uuid,
}

impl<S> FromRequestParts<S> for AuthUser
where
    PgPool: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let pool = PgPool::from_ref(state);

        let token = parts
            .headers
            .get(axum::http::header::AUTHORIZATION)
            .and_then(|v| v.to_str().ok())
            .and_then(|v| v.strip_prefix("Bearer "))
            .map(|v| v.to_string())
            .ok_or((StatusCode::UNAUTHORIZED, "Missing or malformed Auth token".to_string()))?;

        let user_id: Option<Uuid> = sqlx::query_scalar(
            "SELECT user_id FROM sessions WHERE token = $1 AND expires_at > now()",
        )
        .bind(&token)
        .fetch_optional(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        match user_id {
            Some(id) => Ok(AuthUser { user_id: id }),
            None => Err((StatusCode::UNAUTHORIZED, "Invalid or expired Auth token".to_string())),
        }
    }
}