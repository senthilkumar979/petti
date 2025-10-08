-- Complete fix for smtp_config table
-- This will drop and recreate the table with the correct structure
-- Drop the existing table completely
DROP TABLE IF EXISTS public.smtp_config CASCADE;
-- Drop any existing functions and triggers
DROP FUNCTION IF EXISTS update_smtp_config_updated_at() CASCADE;
DROP FUNCTION IF EXISTS ensure_single_active_smtp_config() CASCADE;
-- Create the table with the EXACT structure the API expects
CREATE TABLE public.smtp_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL CHECK (
    provider IN ('gmail', 'outlook', 'zoho', 'custom')
  ),
  host TEXT NOT NULL,
  port INTEGER NOT NULL CHECK (
    port > 0
    AND port <= 65535
  ),
  secure BOOLEAN NOT NULL DEFAULT false,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  "fromName" TEXT NOT NULL,
  "fromEmail" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Enable Row Level Security
ALTER TABLE public.smtp_config ENABLE ROW LEVEL SECURITY;
-- Create simple policies that allow all operations
CREATE POLICY "Allow all operations on smtp_config" ON public.smtp_config FOR ALL USING (true) WITH CHECK (true);
-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_smtp_config_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW."updatedAt" = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Create trigger to automatically update updatedAt
CREATE TRIGGER update_smtp_config_updated_at BEFORE
UPDATE ON public.smtp_config FOR EACH ROW EXECUTE FUNCTION update_smtp_config_updated_at();
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_smtp_config_provider ON public.smtp_config(provider);
CREATE INDEX IF NOT EXISTS idx_smtp_config_active ON public.smtp_config("isActive");
CREATE INDEX IF NOT EXISTS idx_smtp_config_created_at ON public.smtp_config("createdAt");
-- Ensure only one active configuration at a time
CREATE OR REPLACE FUNCTION ensure_single_active_smtp_config() RETURNS TRIGGER AS $$ BEGIN -- If the new record is being set as active, deactivate all others
  IF NEW."isActive" = true THEN
UPDATE public.smtp_config
SET "isActive" = false
WHERE id != NEW.id
  AND "isActive" = true;
END IF;
RETURN NEW;
END;
$$ language 'plpgsql';
-- Create trigger to ensure only one active configuration
CREATE TRIGGER ensure_single_active_smtp_config_trigger BEFORE
INSERT
  OR
UPDATE ON public.smtp_config FOR EACH ROW EXECUTE FUNCTION ensure_single_active_smtp_config();
-- Verify the table structure
SELECT column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'smtp_config'
  AND table_schema = 'public'
ORDER BY ordinal_position;
-- Test insert to verify the structure works
INSERT INTO public.smtp_config (
    provider,
    host,
    port,
    secure,
    username,
    password,
    "fromName",
    "fromEmail",
    "isActive"
  )
VALUES (
    'gmail',
    'smtp.gmail.com',
    587,
    false,
    'test@example.com',
    'password',
    'Test Sender',
    'test@example.com',
    true
  );
-- Clean up the test record
DELETE FROM public.smtp_config
WHERE username = 'test@example.com';