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

CREATE TABLE IF NOT EXISTS providers (
  id VARCHAR(50)
  , active BOOLEAN DEFAULT true
  , name VARCHAR(100) NOT NULL
  , description TEXT
  , country_code VARCHAR(2) NOT NULL
  , logo_url TEXT NOT NULL
  , extra_attrs JSONB 
  , last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  , created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  , PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS provider_urls (
  provider_id VARCHAR(50) NOT NULL
  , name VARCHAR(100) NOT NULL
  , url TEXT NOT NULL
  , sequence INTEGER NOT NULl
  , FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS provider_emails (
  provider_id VARCHAR(50) NOT NULL
  , name VARCHAR(100) NOT NULL
  , email VARCHAR(150) NOT NULL
  , sequence INTEGER NOT NULl
  , FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS provider_phones (
  provider_id VARCHAR(50) NOT NULL
  , name VARCHAR(100) NOT NULL
  , number VARCHAR(50) NOT NULL
  , working_hours VARCHAR(50) NOT NULL
  , sequence INTEGER NOT NULl
  , FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_providers (
  user_id UUID
  , provider_id VARCHAR(50)
  , FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  , FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE
  , PRIMARY KEY(user_id, provider_id)
);

CREATE TABLE IF NOT EXISTS provider_contract (
  id UUID
  , user_id UUID NOT NULL
  , provider_id VARCHAR(50) NOT NULL
  , renewable BOOLEAN
  
  , reminder_active BOOLEAN DEFAULT true
  , last_reminder_date TIMESTAMPTZ
  , reminder_unit VARCHAR(10) CHECK (reminder_unit IN ('d', 'w', 'm', 'y'))
  , reminder_value INTEGER

  , recurring_unit VARCHAR(10) CHECK (recurring_unit IN ('d', 'w', 'm', 'y'))
  , recurring_value INTEGER

  , started_at TIMESTAMPTZ
  , expires_at TIMESTAMPTZ
  , last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  , created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  , FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  , FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE
  , PRIMARY KEY(id)
);

-- Subscription end date and how to ask the user input and how to store it
CREATE TABLE IF NOT EXISTS provider_subscriptions (
  id UUID -- it should be time uuid
  , user_id UUID NOT NULL
  , provider_id VARCHAR(50) NOT NULL
  , contract_id UUID

  , type VARCHAR(10) CHECK (type IN ('c', 's', 'o'))
  , title VARCHAR(100) NOT NULL

  , payment_method VARCHAR(100)
  , payment_method_name VARCHAR(100)
  , amount FLOAT NOT NULL
  , currency VARCHAR(5) NOT NULL
  , next_payment_date TIMESTAMPTZ

  , last_reminder_date TIMESTAMPTZ
  , reminder_active BOOLEAN DEFAULT true
  , reminder_unit VARCHAR(10) CHECK (reminder_unit IN ('d', 'w', 'm', 'y'))
  , reminder_value INTEGER

  , recurring_unit VARCHAR(10) CHECK (recurring_unit IN ('d', 'w', 'm', 'y'))
  , recurring_value INTEGER
  , last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  , created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  , FOREIGN KEY (contract_id) REFERENCES provider_contract (id) ON DELETE CASCADE
  , FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  , FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE
  , PRIMARY KEY(id)
);

-- Contract {
--   documents?
-- }
-- this.providerRepository.searchSubscription()
-- this.providerRepository.findSubscriptionWithContractAndDocuments()

CREATE TABLE IF NOT EXISTS user_documents (
  id UUID 
  , user_id UUID NOT NULL
  , contract_id UUID 
  , provider_subscription_id UUID
  , type VARCHAR(10) CHECK (type IN ('c', 's', 'p'))
  , filename VARCHAR(100)
  , path TEXT
  , created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  , FOREIGN KEY (contract_id) REFERENCES provider_contract (id) ON DELETE CASCADE
  , FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  , FOREIGN KEY (provider_subscription_id) REFERENCES provider_subscriptions (id) ON DELETE CASCADE
  , PRIMARY KEY(id)
);

GET /v1/providers
GET /v1/providers/:id

GET /v1/providers/users/:user_id/providers
POST /v1/providers/users/providers
DELETE /v1/providers/users/providers

GET /v1/providers/users/:user_id/subscriptions?type=contract&limit=10
GET /v1/providers/users/:user_id/subscriptions/:id this.providerRepository.findSubscriptionWithContractAndDocuments()
POST /v1/providers/users/subscriptions
PUT /v1/providers/users/subscriptions
DELETE /v1/providers/users/subscriptions

GET /v1/providers/users/:user_id/contracts
GET /v1/providers/users/:user_id/contracts/:id this.providerRepository.findContractWithSubscriptionsAndDocuments()
POST /v1/providers/users/contracts
PUT /v1/providers/users/contracts
DELETE /v1/providers/users/contracts

GET /v1/providers/users/:user_id/documents?type=contract&filter[0]['name']=contractId&filter[0]['operator']=equals&filter[0]['value']={contract_id}&limit=1
GET /v1/providers/users/:user_id/documents/:id/download
POST /v1/providers/users/documents
DELETE /v1/providers/users/documents

CREATE INDEX CONCURRENTLY IF NOT EXISTS "providers_search_idx" ON "providers" USING gist((name) gist_trgm_ops);

ALTER TABLE users OWNER TO app;
ALTER TABLE user_auth_strategies OWNER TO app;
ALTER TABLE user_auth_devices OWNER TO app;
ALTER TABLE user_verification_codes OWNER TO app;

ALTER TABLE providers OWNER TO app;
ALTER TABLE provider_urls OWNER TO app;
ALTER TABLE provider_emails OWNER TO app;
ALTER TABLE provider_phones OWNER TO app;
ALTER TABLE user_providers OWNER TO app;
ALTER TABLE provider_contract OWNER TO app;
ALTER TABLE provider_subscriptions OWNER TO app;
ALTER TABLE user_documents OWNER TO app;