-- Remove phone_number column from talk_submissions table
-- Phone numbers are now stored in profiles table only
ALTER TABLE talk_submissions
DROP COLUMN phone_number;

