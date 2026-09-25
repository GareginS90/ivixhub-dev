ALTER TABLE phone_verification_codes
    ADD COLUMN IF NOT EXISTS attempts_left INTEGER NOT NULL DEFAULT 5;
