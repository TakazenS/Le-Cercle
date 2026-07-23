# Le Cercle

**Le Cercle** is a **private, self-hosted** desktop chat application — think of it as a "private Discord". One person hosts the server, sets an access code, and invites only the people they choose. Members chat in text channels, with accounts, profiles, online presence, and a customizable roles & permissions system.

Key idea: **the application is itself a server**. There is no "create a server" step inside the app — running it in host mode *is* running a server. Anyone who clones this repository can therefore host **their own** independent Cercle, with **their own** access code and **their own** database.

> 🚧 **Work in progress** (and a Rust learning project). The technical foundation (app, server, database connection) is in place; features are being added incrementally (see the [roadmap](#roadmap)).

## Tech stack

| Layer | Technology |
|---|---|
| Desktop app | [Tauri 2](https://tauri.app/) (Rust) |
| UI | React 19 + TypeScript + Vite |
| Server | Rust — [tokio](https://tokio.rs/) (async) + [axum](https://github.com/tokio-rs/axum) |
| Database | PostgreSQL (via [sqlx](https://github.com/launchbadge/sqlx)) — tested with [Neon](https://neon.com) |

## Architecture (in short)

Three layers: the **client** (the Tauri app) talks to the **server** (the Rust core), and **only the server** talks to the **PostgreSQL database**. A member never connects to the database directly — the server is the single authority (authentication, permissions, real-time). Real-time communication will run over WebSocket.

## Project structure

```
le-cercle/
├─ Cargo.toml          # Cargo workspace (groups the Rust crates)
├─ src/                # React + TypeScript frontend
├─ src-tauri/          # Rust core of the Tauri app
├─ crates/
│  ├─ server/          # the server (axum + tokio + sqlx)
│  │  └─ .env.example  # configuration template (copy to .env)
│  └─ shared/          # shared types & protocol
├─ package.json        # frontend dependencies
└─ index.html
```

## Prerequisites

- [Rust](https://rustup.rs) (with the default toolchain)
- [Node.js](https://nodejs.org) (LTS) + npm
- A reachable **PostgreSQL** database (easiest: a free project on [Neon](https://neon.com))
- **sqlx-cli** for database migrations: `cargo install sqlx-cli --no-default-features --features rustls,postgres`
- On Windows: the C++ build tools (installed automatically with Rust) and the WebView2 runtime (present by default on Windows 10/11)

## Running in development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd le-cercle
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Configure the database** — copy the template and fill in your connection string:
   ```bash
   cp crates/server/.env.example crates/server/.env
   # then edit crates/server/.env and set your DATABASE_URL
   ```
   The template also sets `SERVER_BIND=0.0.0.0:8080`, which makes the server reachable from other machines on your network. Change it to `127.0.0.1:8080` if you want local-only access.

4. **Run the database migrations** — this creates the tables in your database:
   ```bash
   cd crates/server
   sqlx migrate run
   ```

5. **Start the server** (in the same terminal):
   ```bash
   cargo run
   ```
   You should see "Connected to Postgres…" then "Server started on <your-machine-IP>:8080" — that detected address (not `127.0.0.1`) is what other machines on your network use to reach the server.
   On the **very first launch**, the server also generates a random 8-character **access code** and prints it in the console — note it down, it is what new members will need to sign up.

6. **Start the application** (in a second terminal, from the project root):
   ```bash
   npm run tauri dev
   ```
   The first Tauri Rust build takes a few minutes; a desktop window then opens.

## Secrets & configuration

The `crates/server/.env` file holds the database connection string (**a secret**). It is **ignored by git** (see `.gitignore`) and must **never** be published. Only `crates/server/.env.example` (which contains no secret) is versioned, as a template.

## Database & migrations

The database schema is managed with **sqlx migrations** — versioned SQL files in `crates/server/migrations/`. sqlx records which migrations have already been applied (in a `_sqlx_migrations` table), so it only runs the missing ones. This means any database — yours, a contributor's, or a fresh clone — reaches the exact same schema by running:

```bash
cd crates/server
sqlx migrate run
```

To change the schema, **never edit an already-applied migration** (sqlx verifies a checksum and will refuse). Create a new one instead:

```bash
sqlx migrate add <name>      # creates a new timestamped .sql file
# write your change (e.g. ALTER TABLE ...), then apply it:
sqlx migrate run
```

## Roadmap

> **Current focus:** the main chat layout (channels sidebar, members panel, message area).

- [x] Foundation: Tauri app + Rust server + PostgreSQL connection
- [x] Server bootstrap (auto-generated access code + default roles) & structured logging (`tracing`)
- [x] Accounts: sign-up with access code, login, password hashing (Argon2), sessions
- [x] Auth UI: login / register screens, client- and server-side validation, light/dark theme, custom accent color
- [x] Multi-server client: add / edit / remove servers, select the active server
- [x] Session middleware + authenticated routes (`/me`)
- [ ] Main chat layout (channels sidebar, members panel, message area)
- [ ] Text channels (create / delete)
- [ ] Real-time messages (WebSocket) + persistent history
- [ ] Online / offline presence
- [ ] Customizable roles & permissions
- [ ] *(later)* migration to a remote server (VPS), voice channels

## License

Released under the [MIT License](LICENSE).
