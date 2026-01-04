-- V2__seed_admin.sql
-- Seed ADMIN user (idempotent)

INSERT INTO users (email, password_hash, phone, phone_verified, role, is_active, created_at, updated_at)
SELECT
  'admin@ivixhub.am',
  '$2a$10$B3PyfbYFJ6SXLhUAJkup1OiFoFJF2kktjNnw.9oOWTE4H0/P2Xlgy',
  NULL,
  TRUE,
  'ADMIN',
  TRUE,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@ivixhub.am'
);
