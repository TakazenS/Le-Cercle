use tracing::info;
use crate::auth::{ create_hash, generate_access_code };

/*======= Constants =======*/
const PERM_SEND_MESSAGES: i64 = 1 << 4;
const ALL_PERMISSIONS: i64 = (1 << 6) - 1;

/*======= Functions =======*/
pub async fn lead_in(pool: &sqlx::PgPool) -> Result<(), sqlx::Error> {
    let config = sqlx::query("SELECT id FROM server_config WHERE id = 1")
        .fetch_optional(pool)
        .await?;

    if config.is_some() {
        return Ok(info!("Config already exists"));
    }

    let code = generate_access_code();
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