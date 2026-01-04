-- V7__payment_events_nullable_intent.sql
-- Allow webhook receipts to be stored before we can map them to a payment_intent_id

ALTER TABLE payment_events
  ALTER COLUMN payment_intent_id DROP NOT NULL;
