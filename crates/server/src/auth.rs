use rand::RngExt;
use argon2::{
    Argon2,
    PasswordHasher,
    password_hash::{ SaltString, rand_core::OsRng },
};

/*======= Constants =======*/
const ALPHABET: &[u8] = b"ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";

/*======= Functions =======*/
pub fn generate_access_code() -> String {
    let mut rng = rand::rng();
    (0..8)
        .map(|_| {
            let i = rng.random_range(0..ALPHABET.len());
            ALPHABET[i] as char
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