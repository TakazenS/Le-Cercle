use rand::RngExt;
use argon2::{
    Argon2,
    PasswordHasher,
    password_hash::{ SaltString, rand_core::OsRng },
};

/*======= Constants =======*/
const ACCESS_CODE_ALPHABET: &[u8] = b"ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
const SESSION_TOKEN_ALPHABET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/*======= Functions =======*/
pub fn generate_access_code() -> String {
    let mut rng = rand::rng();
    (0..8)
        .map(|_| {
            let i = rng.random_range(0..ACCESS_CODE_ALPHABET.len());
            ACCESS_CODE_ALPHABET[i] as char
        })
        .collect()
}

pub fn generate_session_token() -> String {
    let mut rng = rand::rng();
    (0..32)
        .map(|_| {
            let i = rng.random_range(0..SESSION_TOKEN_ALPHABET.len());
            SESSION_TOKEN_ALPHABET[i] as char
        })
        .collect()
}

pub fn create_hash(secret: &str) -> String {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    argon2
        .hash_password(secret.as_bytes(), &salt)
        .expect("Failed to hash")
        .to_string()
}
