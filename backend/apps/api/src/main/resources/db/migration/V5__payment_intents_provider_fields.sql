-- V5__payment_intents_provider_fields.sql
-- Add provider fields for real payment integrations (idempotent-ish)

ALTER TABLE payment_intents
  ADD COLUMN IF NOT EXISTS provider_payment_id VARCHAR(128);

ALTER TABLE payment_intents
  ADD COLUMN IF NOT EXISTS checkout_url TEXT;
