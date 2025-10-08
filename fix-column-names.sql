-- Fix column names in smtp_config table to match API expectations
-- Run this SQL script in your Supabase SQL editor
-- Rename columns to match the API expectations (camelCase)
ALTER TABLE public.smtp_config
  RENAME COLUMN fromname TO "fromName";
ALTER TABLE public.smtp_config
  RENAME COLUMN fromemail TO "fromEmail";
ALTER TABLE public.smtp_config
  RENAME COLUMN isactive TO "isActive";
ALTER TABLE public.smtp_config
  RENAME COLUMN createdat TO "createdAt";
ALTER TABLE public.smtp_config
  RENAME COLUMN updatedat TO "updatedAt";
-- Verify the column names are now correct
SELECT column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'smtp_config'
  AND table_schema = 'public'
ORDER BY ordinal_position;