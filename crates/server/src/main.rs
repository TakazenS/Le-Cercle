use axum::{routing::get, Router};
use sqlx::postgres::PgPoolOptions;
use shared::{get_port, get_ip, get_url};

#[tokio::main]
async fn main() {
    let port = get_port();
    let ip = get_ip();
    let url = get_url();
    
    dotenvy::dotenv().ok();

    let db_url = std::env::var("DB_URL")
        .expect("DB_URL must be set in .env");

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&db_url)
        .await
        .expect("Failed to connect to the database");

    let version: (String,) = sqlx::query_as("SELECT version()")
        .fetch_one(&pool)
        .await
        .expect("Failed to get test query");
    println!("Connected to Postgres : {}", version.0);


    let app = Router::new().route("/", get(handler));
    let listener = tokio::net::TcpListener::bind(format!("{ip}:{port}"))
        .await
        .unwrap();
    println!("Server started on {url}");
    axum::serve(listener, app).await.unwrap();
}

async fn handler() -> &'static str {
    "Le Cercle - Server Online !"
}
