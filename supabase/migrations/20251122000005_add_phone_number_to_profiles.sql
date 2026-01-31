-- Add phone_number column to profiles table
ALTER TABLE profiles
ADD COLUMN phone_number TEXT;

-- Create index on phone_number for faster lookups (optional, but useful if you'll search by phone)
CREATE INDEX idx_profiles_phone_number ON profiles(phone_number)
WHERE phone_number IS NOT NULL;

