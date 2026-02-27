-- Add talk_hook column to talk_submissions (after talk_synopsis)
-- Hook is short, punchy text for the video thumbnail.
-- Nullable — defaults to the talk title when not provided.
ALTER TABLE talk_submissions
ADD COLUMN talk_hook TEXT CHECK (talk_hook IS NULL OR LENGTH(talk_hook) <= 50);
