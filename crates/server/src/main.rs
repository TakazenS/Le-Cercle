mod models;
mod auth;
mod handlers;
mod bootstrap;
mod validation;

use handlers::{ handler, register, login };
use bootstrap::lead_in;
use sqlx::postgres::PgPoolOptions;
use tower_http::cors::CorsLayer;
use tracing::info;
use shared::{ get_ip, get_port, get_url };
use tracing_subscriber::{ fmt, EnvFilter };
use axum::{
    routing::{ get, post },
    Router,
};
/*======= Main =======*/
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

    /*======= Routes =======*/
    let app = Router::new()
        .route("/", get(handler))
        .route("/register", post(register))
        .route("/login", post(login))
        .layer(CorsLayer::permissive())
        .with_state(pool.clone());

    let listener = tokio::net::TcpListener::bind(format!("{ip}:{port}"))
        .await
        .unwrap();
    info!("Server started on {url}");
    axum::serve(listener, app).await.unwrap();
}
