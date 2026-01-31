-- Update handle format constraint to use clearer alternation pattern
-- This avoids ambiguity with hyphens in character classes
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS handle_format_check;

ALTER TABLE profiles
ADD CONSTRAINT handle_format_check CHECK (
	handle IS NULL OR (
		handle ~ '^(?:[a-z0-9_]|-)+$' AND
		LENGTH(handle) >= 3 AND
		LENGTH(handle) <= 30
	)
);

