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
