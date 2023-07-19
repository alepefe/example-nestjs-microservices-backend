CREATE USER app WITH PASSWORD 'Testtest1';
CREATE DATABASE app WITH OWNER app;
\c app

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE IF NOT EXISTS users (
    id UUID
  , active BOOLEAN NOT NULL DEFAULT true
  , email_verified BOOLEAN NOT NULL DEFAULT false
  , email VARCHAR(200) NOT NULL
  , name VARCHAR(100)
  , surname VARCHAR(100)
  , phone VARCHAR(20)
  , roles VARCHAR(20)[] NOT NULL
  , last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  , created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  , PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS user_auth_strategies (
  user_id UUID
  , email VARCHAR(200) NOT NULL
  , name VARCHAR(20) CHECK (name IN ('local', 'google_id_token', 'google_access_token'))
  , active BOOLEAN NOT NULL DEFAULT true
  , provider_id VARCHAR(100)
  , password VARCHAR(200)
  , last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  , created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  , FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  , PRIMARY KEY(user_id, name)
);

CREATE TABLE IF NOT EXISTS user_auth_devices (
  user_id UUID
  , device_id VARCHAR(100)
  , name TEXT NOT NULL
  , agent TEXT NOT null
  , attrs JSONB
  , last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  , created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP 
  , FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  , PRIMARY KEY(user_id, device_id)
);

CREATE TABLE IF NOT EXISTS user_verification_codes (
  user_id UUID NOT NULL
  , type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'reset_password'))
  , code VARCHAR(50) NOT NULL
  , expires_at TIMESTAMPTZ NOT NULL
  , created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP 
  , FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

ALTER TABLE users OWNER TO app;
ALTER TABLE user_auth_strategies OWNER TO app;
ALTER TABLE user_auth_devices OWNER TO app;
ALTER TABLE user_verification_codes OWNER TO app;