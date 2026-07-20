-- Add migration script here
ALTER TABLE users
    ADD COLUMN pseudo TEXT,
    ADD CONSTRAINT users_nickname_unique UNIQUE (nickname);

UPDATE users SET pseudo = nickname;

ALTER TABLE users
    ALTER COLUMN pseudo SET NOT NULL;
