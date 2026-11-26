-- Apply only to an isolated Neon development branch first.
CREATE TABLE IF NOT EXISTS account_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  username text NOT NULL,
  email text NOT NULL,
  password_hash text NOT NULL,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT account_requests_username_unique UNIQUE (username),
  CONSTRAINT account_requests_email_unique UNIQUE (email)
);

CREATE UNIQUE INDEX IF NOT EXISTS account_requests_username_lower_idx ON account_requests (lower(username));
CREATE UNIQUE INDEX IF NOT EXISTS account_requests_email_lower_idx ON account_requests (lower(email));

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES account_requests(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS password_reset_tokens_account_created_idx ON password_reset_tokens(account_id, created_at DESC);
