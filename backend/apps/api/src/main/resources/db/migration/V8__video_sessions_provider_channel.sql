-- V8__video_sessions_provider_channel.sql

ALTER TABLE video_sessions
  ADD COLUMN IF NOT EXISTS provider VARCHAR(40) NOT NULL DEFAULT 'MOCK_VIDEO';

ALTER TABLE video_sessions
  ADD COLUMN IF NOT EXISTS channel_name VARCHAR(128);

CREATE INDEX IF NOT EXISTS idx_vs_channel_name ON video_sessions(channel_name);
