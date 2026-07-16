use tracing::{info};
use tracing_subscriber::{fmt, EnvFilter};
use argon2::{Argon2, PasswordHasher};
use sqlx::postgres::PgPoolOptions;
use argon2::password_hash::SaltString;
use argon2::password_hash::rand_core::OsRng;
use rand::RngExt;
use axum::{routing::get, Router};
use shared::{get_ip, get_port, get_url};

/*=================================
            Constant
=================================*/
const ALPHABET: &[u8] = b"ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
const PERM_SEND_MESSAGES: i64 = 1 << 4;
const ALL_PERMISSIONS: i64 = (1 << 6) - 1;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")))
        .with_target(true)
        .init();

    info!("Starting server...");

    let port = get_port();
    let ip = get_ip();
    let url = get_url();

    let db_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env");

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&db_url)
        .await
        .expect("Failed to connect to the database");

    lead_in(&pool)
        .await
        .expect("Failed to lead in the server");

    let version: (String,) = sqlx::query_as("SELECT version()")
        .fetch_one(&pool)
        .await
        .expect("Failed to get test query");
    info!("Connected to Postgres : {}", version.0);


    let app = Router::new().route("/", get(handler));
    let listener = tokio::net::TcpListener::bind(format!("{ip}:{port}"))
        .await
        .unwrap();
    info!("Server started on {url}");
    axum::serve(listener, app).await.unwrap();
}

/*=================================
          Async Functions
=================================*/
async fn handler() -> &'static str { "Le Cercle - Server Online !" }

async fn lead_in(pool: &sqlx::PgPool) -> Result<(), sqlx::Error> {
    let config = sqlx::query("SELECT id FROM server_config WHERE id = 1")
        .fetch_optional(pool)
        .await?;

    if config.is_some() {
        return Ok(info!("Config already exists"));
    }

    let code = generer_code_acces();
    let code_hash = create_hash(&code);

    sqlx::query(
        "INSERT INTO roles (name, color, permissions, is_owner, position)
             VALUES ($1, $2, $3, TRUE, 100)",
    )
    .bind("Propriétaire")
    .bind("#a06bff")
    .bind(ALL_PERMISSIONS)
    .execute(pool)
    .await?;

    sqlx::query(
        "INSERT INTO roles (name, color, permissions, is_default, position)
             VALUES ($1, $2, $3, TRUE, 0)",
    )
    .bind("@everyone")
    .bind("#99AAB5")
    .bind(PERM_SEND_MESSAGES)
    .execute(pool)
    .await?;

    sqlx::query(
        "INSERT INTO server_config (id, name, access_code_hash) VALUES (1, $1, $2)",
    )
    .bind("Le Cercle")
    .bind(&code_hash)
    .execute(pool)
    .await?;

    println!("=====================================================");
    println!("            Server leaded-in successfuly !           ");
    println!("            Default Access Code : {code}          "   );
    println!("=====================================================");

    Ok(())
}

/*=================================
          Sync Functions
=================================*/
fn generer_code_acces() -> String {
    let mut rng = rand::rng();
    (0..8)
        .map(|_| {
            let i = rng.random_range(0..ALPHABET.len());
            return ALPHABET[i] as char
        })
        .collect()
}

fn create_hash(secret: &str) -> String {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    argon2
        .hash_password(secret.as_bytes(), &salt)
        .expect("Failed to hash")
        .to_string()
}