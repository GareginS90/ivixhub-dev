-- V6__payment_events.sql

CREATE TABLE IF NOT EXISTS payment_events (
  id BIGSERIAL PRIMARY KEY,
  payment_intent_id BIGINT NOT NULL REFERENCES payment_intents(id) ON DELETE CASCADE,
  provider VARCHAR(40) NOT NULL,
  event_type VARCHAR(60) NOT NULL,
  provider_event_id VARCHAR(128),
  payload_hash VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pe_payment_intent_id ON payment_events(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_pe_provider_event_id ON payment_events(provider_event_id);
