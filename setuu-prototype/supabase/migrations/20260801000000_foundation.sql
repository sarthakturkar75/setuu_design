
CREATE TYPE project_type AS ENUM ('commercial', 'residential', 'industrial', 'infrastructure');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'on_hold', 'completed', 'archived');
CREATE TYPE department_type AS ENUM ('civil', 'electrical', 'mechanical', 'plumbing', 'architectural');
CREATE TYPE media_type AS ENUM ('image', 'video', 'document', 'pdf', 'cad');
CREATE TYPE ack_status AS ENUM ('pending', 'acknowledged', 'disputed');
CREATE TYPE notification_type AS ENUM ('mention', 'update', 'alert', 'system', 'approval');

CREATE TABLE IF NOT EXISTS user_identity (
  actor_id uuid PRIMARY KEY,
  email varchar UNIQUE,
  phone varchar,
  full_name varchar NOT NULL,
  password_hash varchar NOT NULL,
  biometric_enabled bool
);

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  max_projects int4 NOT NULL,
  subscription_tier text NOT NULL,
  status text
);

CREATE TABLE IF NOT EXISTS user_actor (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  organization_id uuid,
  created_at timestamptz DEFAULT now(),
  display_name text,
  is_active bool,
  failed_login_attempts int4,
  lockout_until timestamptz,
  bio text,
  avatar_url text
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  client_org_id uuid,
  assigned_pm_id uuid,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  start_date date,
  type project_type,
  tags _text,
  is_archived bool,
  contract_value numeric,
  client_visibility text,
  po_reference text,
  target_date date
);

CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  target_date timestamptz,
  completion_status bool,
  weight_percent int4,
  department text,
  created_at timestamptz DEFAULT now(),
  display_order int4
);

CREATE TABLE IF NOT EXISTS updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  milestone_id uuid,
  author_id uuid NOT NULL,
  caption text,
  location_name text,
  created_at timestamptz DEFAULT now(),
  latitude numeric,
  longitude numeric,
  is_watermarked bool,
  approval_status text
);

CREATE TABLE IF NOT EXISTS media_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id uuid NOT NULL,
  type media_type NOT NULL,
  url text NOT NULL,
  file_name text NOT NULL,
  file_size_bytes int8,
  mime_type text,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id uuid NOT NULL,
  author_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comment_mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL,
  mentioned_user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS acknowledgements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id uuid NOT NULL,
  client_id uuid NOT NULL,
  status ack_status NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  type notification_type NOT NULL,
  reference_id uuid,
  is_read bool NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token text NOT NULL,
  platform text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL
);

