-- Utilisateurs (comptes + profils) --
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT UNIQUE NOT NULL,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    nickname      TEXT NOT NULL,
    avatar        BYTEA,
    avatar_mime   TEXT,
    description   TEXT,
    accent_color  TEXT NOT NULL DEFAULT '#a06bff',
    joined_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rôles (permissions stockées en masque de bits) --
CREATE TABLE roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    color       TEXT NOT NULL,
    permissions BIGINT NOT NULL DEFAULT 0,
    is_default  BOOLEAN NOT NULL DEFAULT FALSE,
    is_owner    BOOLEAN NOT NULL DEFAULT FALSE,
    position    INT NOT NULL DEFAULT 0
);

-- Association plusieurs-à-plusieurs entre utilisateurs et rôles --
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Sessions (garder l'utilisateur connecté) --
CREATE TABLE sessions (
    token      TEXT PRIMARY KEY,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Configuration du serveur (une seule ligne, garantie par le CHECK) --
CREATE TABLE server_config (
    id               INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    name             TEXT NOT NULL,
    access_code_hash TEXT NOT NULL,
    owner_id         UUID REFERENCES users(id),
    accent_default   TEXT NOT NULL DEFAULT '#a06bff'
);