/*======= Structuress =======*/
#[derive(serde::Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub nickname: String,
    pub password: String,
    pub access_code: String,
}