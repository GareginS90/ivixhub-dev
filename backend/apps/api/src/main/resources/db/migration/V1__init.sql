-- V1__init.sql
-- IviXHub schema (PostgreSQL 16)
-- All timestamps are timestamptz (UTC recommended)

BEGIN;

-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id              BIGSERIAL PRIMARY KEY,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  phone           VARCHAR(32),
  phone_verified  BOOLEAN NOT NULL DEFAULT FALSE,
  role            VARCHAR(30) NOT NULL DEFAULT 'CLIENT',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- =========================
-- PHONE VERIFICATION CODES
-- =========================
CREATE TABLE IF NOT EXISTS phone_verification_codes (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone       VARCHAR(32) NOT NULL,
  code        VARCHAR(12) NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pvc_user_id ON phone_verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_pvc_phone ON phone_verification_codes(phone);
CREATE INDEX IF NOT EXISTS idx_pvc_expires ON phone_verification_codes(expires_at);

-- =========================
-- PSYCHOLOGISTS
-- =========================
CREATE TABLE IF NOT EXISTS psychologists (
  id                  BIGSERIAL PRIMARY KEY,
  user_id              BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  status               VARCHAR(40) NOT NULL DEFAULT 'DRAFT',
  experience_years     INT NOT NULL DEFAULT 0,
  bio                  VARCHAR(2000),
  submitted_at         TIMESTAMPTZ,
  verified_at          TIMESTAMPTZ,
  reviewed_by_user_id  BIGINT,
  reviewed_at          TIMESTAMPTZ,
  rejection_reason     VARCHAR(1000),
  active               BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_psych_status ON psychologists(status);
CREATE INDEX IF NOT EXISTS idx_psych_user_id ON psychologists(user_id);

-- psychologists.languages (ElementCollection)
CREATE TABLE IF NOT EXISTS psychologist_languages (
  psychologist_id BIGINT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  language        VARCHAR(10) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_psych_lang_psych_id ON psychologist_languages(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_psych_lang_val ON psychologist_languages(language);

-- psychologists.methods (ElementCollection)
CREATE TABLE IF NOT EXISTS psychologist_methods (
  psychologist_id BIGINT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  method          VARCHAR(50) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_psych_method_psych_id ON psychologist_methods(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_psych_method_val ON psychologist_methods(method);

-- psychologists.specializations (ElementCollection)
CREATE TABLE IF NOT EXISTS psychologist_specializations (
  psychologist_id BIGINT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  specialization  VARCHAR(100) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_psych_spec_psychologist_id ON psychologist_specializations(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_psych_spec_lower ON psychologist_specializations (lower(specialization::text));

-- psychologist documents
CREATE TABLE IF NOT EXISTS psychologist_documents (
  id             BIGSERIAL PRIMARY KEY,
  psychologist_id BIGINT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  doc_type       VARCHAR(50) NOT NULL,
  file_name      VARCHAR(255) NOT NULL,
  file_url       VARCHAR(2000) NOT NULL,
  uploaded_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_psych_docs_psych_id ON psychologist_documents(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_psych_docs_type ON psychologist_documents(doc_type);

-- psychologist weekly availability
CREATE TABLE IF NOT EXISTS psychologist_availability (
  id              BIGSERIAL PRIMARY KEY,
  psychologist_id BIGINT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  day_of_week     VARCHAR(10) NOT NULL,
  start_time_utc  TIME NOT NULL,
  end_time_utc    TIME NOT NULL,
  active          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_pa_psychologist_id ON psychologist_availability(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_pa_day ON psychologist_availability(day_of_week);

-- =========================
-- BOOKINGS
-- =========================
CREATE TABLE IF NOT EXISTS bookings (
  id               BIGSERIAL PRIMARY KEY,
  client_user_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  psychologist_id  BIGINT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  session_type     VARCHAR(20) NOT NULL,
  start_at         TIMESTAMPTZ NOT NULL,
  end_at           TIMESTAMPTZ NOT NULL,
  status           VARCHAR(40) NOT NULL DEFAULT 'CREATED',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_client_user_id ON bookings(client_user_id);
CREATE INDEX IF NOT EXISTS idx_booking_psychologist_id ON bookings(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_booking_start_at ON bookings(start_at);

-- =========================
-- PAYMENTS
-- =========================
CREATE TABLE IF NOT EXISTS payment_intents (
  id            BIGSERIAL PRIMARY KEY,
  booking_id    BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  client_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_minor  BIGINT NOT NULL,
  currency      VARCHAR(10) NOT NULL DEFAULT 'AMD',
  status        VARCHAR(20) NOT NULL DEFAULT 'INITIATED',
  provider      VARCHAR(50) NOT NULL DEFAULT 'MOCK',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pi_booking_id ON payment_intents(booking_id);
CREATE INDEX IF NOT EXISTS idx_pi_client_user_id ON payment_intents(client_user_id);

CREATE TABLE IF NOT EXISTS escrow_holds (
  id             BIGSERIAL PRIMARY KEY,
  booking_id     BIGINT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  psychologist_id BIGINT NOT NULL REFERENCES psychologists(id) ON DELETE CASCADE,
  amount_minor   BIGINT NOT NULL,
  currency       VARCHAR(10) NOT NULL DEFAULT 'AMD',
  status         VARCHAR(20) NOT NULL DEFAULT 'HOLD',
  hold_until     TIMESTAMPTZ NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eh_booking_id ON escrow_holds(booking_id);
CREATE INDEX IF NOT EXISTS idx_eh_psychologist_id ON escrow_holds(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_eh_status ON escrow_holds(status);

-- =========================
-- VIDEO SESSIONS
-- =========================
CREATE TABLE IF NOT EXISTS video_sessions (
  id         BIGSERIAL PRIMARY KEY,
  booking_id BIGINT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  room_id    VARCHAR(100) NOT NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  ended_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_vs_booking_id ON video_sessions(booking_id);
CREATE INDEX IF NOT EXISTS idx_vs_room_id ON video_sessions(room_id);

-- =========================
-- CHAT
-- =========================
CREATE TABLE IF NOT EXISTS chat_messages (
  id            BIGSERIAL PRIMARY KEY,
  booking_id    BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_role   VARCHAR(20) NOT NULL,
  message_text  VARCHAR(4000) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cm_booking_id ON chat_messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_cm_created_at ON chat_messages(created_at);

-- =========================
-- NOTIFICATIONS (in-app)
-- =========================
CREATE TABLE IF NOT EXISTS notifications (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(200) NOT NULL,
  body       VARCHAR(2000) NOT NULL,
  type       VARCHAR(50) NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_created_at ON notifications(created_at);

-- =========================
-- AUDIT
-- =========================
CREATE TABLE IF NOT EXISTS audit_events (
  id            BIGSERIAL PRIMARY KEY,
  actor_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  action        VARCHAR(100) NOT NULL,
  target_type   VARCHAR(100),
  target_id     BIGINT,
  details       VARCHAR(4000),
  ip            VARCHAR(64),
  user_agent    VARCHAR(300),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor_user_id ON audit_events(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_events(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_events(action);

COMMIT;
