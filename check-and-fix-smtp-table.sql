-- Check and fix smtp_config table structure
-- Run this SQL script in your Supabase SQL editor
-- First, let's see what columns exist in the current table
SELECT column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'smtp_config'
  AND table_schema = 'public'
ORDER BY ordinal_position;
-- Drop the existing table and recreate it with the correct structure
DROP TABLE IF EXISTS public.smtp_config CASCADE;
-- Create the table with the exact column names the API expects
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
  fromName TEXT NOT NULL,
  fromEmail TEXT NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Enable Row Level Security
ALTER TABLE public.smtp_config ENABLE ROW LEVEL SECURITY;
-- Create policies
CREATE POLICY "Allow all operations on smtp_config" ON public.smtp_config FOR ALL USING (true) WITH CHECK (true);
-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_smtp_config_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW."updatedAt" = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- Create trigger
CREATE TRIGGER update_smtp_config_updated_at BEFORE
UPDATE ON public.smtp_config FOR EACH ROW EXECUTE FUNCTION update_smtp_config_updated_at();
-- Create indexes
CREATE INDEX IF NOT EXISTS idx_smtp_config_provider ON public.smtp_config(provider);
CREATE INDEX IF NOT EXISTS idx_smtp_config_active ON public.smtp_config(isActive);
-- Verify the table structure
SELECT column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'smtp_config'
  AND table_schema = 'public'
ORDER BY ordinal_position;