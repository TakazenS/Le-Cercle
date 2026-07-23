use std::sync::LazyLock;
use regex::Regex;

pub struct Patterns {
    pub name: Regex,
    pub email: Regex,
    pub pseuname: Regex,
    pub access_code: Regex,
}

pub static PATTERNS: LazyLock<Patterns> = LazyLock::new(|| Patterns {
    name: Regex::new(r"^[\p{L}\p{M}' -]{2,64}$").unwrap(),
    email: Regex::new(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$").unwrap(),
    pseuname: Regex::new(r"^[\p{L}\p{M}\p{N}]{2,32}$").unwrap(),
    access_code: Regex::new(r"^[A-Z0-9]{8}$").unwrap(),
});

pub fn is_strong_password(password: &str) -> bool {
    password.chars().count() >= 12
        && password.chars().any(|c| c.is_lowercase())
        && password.chars().any(|c| c.is_uppercase())
        && password.chars().any(|c| c.is_ascii_digit())
        && password.chars().any(|c| !c.is_alphanumeric())
}