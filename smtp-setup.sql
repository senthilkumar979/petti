-- SMTP Configuration table setup
-- Run this SQL script in your Supabase SQL editor to create the necessary table

-- Create smtp_config table
CREATE TABLE IF NOT EXISTS public.smtp_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook', 'zoho', 'custom')),
    host TEXT NOT NULL,
    port INTEGER NOT NULL CHECK (port > 0 AND port <= 65535),
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

-- Create RLS policies for smtp_config table
CREATE POLICY "Allow read access to smtp_config" ON public.smtp_config
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to smtp_config" ON public.smtp_config
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to smtp_config" ON public.smtp_config
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to smtp_config" ON public.smtp_config
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_smtp_config_active ON public.smtp_config(isActive);
CREATE INDEX IF NOT EXISTS idx_smtp_config_provider ON public.smtp_config(provider);

-- Create a function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_smtp_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updatedAt
CREATE TRIGGER update_smtp_config_updated_at 
    BEFORE UPDATE ON public.smtp_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_smtp_config_updated_at();

-- Ensure only one active configuration at a time
CREATE OR REPLACE FUNCTION ensure_single_active_smtp_config()
RETURNS TRIGGER AS $$
BEGIN
    -- If the new record is being set as active, deactivate all others
    IF NEW.isActive = true THEN
        UPDATE public.smtp_config 
        SET isActive = false 
        WHERE id != NEW.id AND isActive = true;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to ensure only one active configuration
CREATE TRIGGER ensure_single_active_smtp_config_trigger
    BEFORE INSERT OR UPDATE ON public.smtp_config
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_active_smtp_config();
