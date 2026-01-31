-- Add length constraints to talk_submissions table
-- Use NOT VALID to allow constraint on existing invalid data, then validate
ALTER TABLE talk_submissions
ADD CONSTRAINT talk_title_length CHECK (
	LENGTH(talk_title) >= 10 AND LENGTH(talk_title) <= 200
) NOT VALID;

-- Fix any existing invalid data (pad short titles, truncate long ones)
UPDATE talk_submissions
SET talk_title = CASE
	WHEN LENGTH(talk_title) < 10 THEN talk_title || ' (Updated)'
	WHEN LENGTH(talk_title) > 200 THEN SUBSTRING(talk_title, 1, 197) || '...'
	ELSE talk_title
END
WHERE LENGTH(talk_title) < 10 OR LENGTH(talk_title) > 200;

-- Now validate the constraint
ALTER TABLE talk_submissions
VALIDATE CONSTRAINT talk_title_length;

ALTER TABLE talk_submissions
ADD CONSTRAINT talk_synopsis_length CHECK (
	LENGTH(talk_synopsis) >= 100 AND LENGTH(talk_synopsis) <= 2000
) NOT VALID;

-- Fix any existing invalid synopsis data
UPDATE talk_submissions
SET talk_synopsis = CASE
	WHEN LENGTH(talk_synopsis) < 100 THEN talk_synopsis || ' ' || REPEAT('.', GREATEST(1, 100 - LENGTH(talk_synopsis) - 1))
	WHEN LENGTH(talk_synopsis) > 2000 THEN SUBSTRING(talk_synopsis, 1, 1997) || '...'
	ELSE talk_synopsis
END
WHERE LENGTH(talk_synopsis) < 100 OR LENGTH(talk_synopsis) > 2000;

-- Now validate the constraint
ALTER TABLE talk_submissions
VALIDATE CONSTRAINT talk_synopsis_length;

ALTER TABLE talk_submissions
ADD CONSTRAINT slides_url_length CHECK (
	slides_url IS NULL OR LENGTH(slides_url) <= 2048
);

-- Add phone number constraint to profiles table
ALTER TABLE profiles
ADD CONSTRAINT phone_number_length CHECK (
	phone_number IS NULL OR LENGTH(phone_number) <= 20
);

