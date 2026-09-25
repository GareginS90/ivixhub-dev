ALTER TABLE phone_verification_codes
    ADD COLUMN IF NOT EXISTS code_hash VARCHAR(255);

UPDATE phone_verification_codes
SET code_hash = code
WHERE code_hash IS NULL;

ALTER TABLE phone_verification_codes
    ALTER COLUMN code_hash SET NOT NULL;

ALTER TABLE phone_verification_codes
    DROP COLUMN IF EXISTS code;
