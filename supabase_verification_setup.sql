-- Add verification columns to profiles table
-- We set DEFAULT TRUE so existing users don't get locked out.
-- New users will be explicitly set to FALSE by the registration logic.
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verification_code TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE;
