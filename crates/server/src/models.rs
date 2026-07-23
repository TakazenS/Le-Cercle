/*======= Structuress =======*/
#[derive(serde::Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub pseudo: String,
    pub nickname: String,
    pub password: String,
    pub access_code: String,
}

#[derive(serde::Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(serde::Serialize)]
pub struct AuthResponse {
    pub token: String,
}

#[derive(serde::Serialize)]
pub struct MeResponse {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub nickname: String,
    pub pseudo: String,
    pub description: Option<String>,
}
