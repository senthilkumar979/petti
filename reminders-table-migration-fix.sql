-- Fix reminders table column names
-- Run this SQL script in your Supabase SQL editor
-- First, check if the table exists and drop it if needed
DROP TABLE IF EXISTS public.reminders CASCADE;
-- Create the reminders table with correct snake_case column names
CREATE TABLE public.reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  reminder_date DATE NOT NULL,
  reminder_type TEXT NOT NULL CHECK (
    reminder_type IN (
      'reminderOne',
      'reminderTwo',
      'reminderThree',
      'renewal'
    )
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create indexes
CREATE INDEX idx_reminders_subscription_id ON public.reminders(subscription_id);
CREATE INDEX idx_reminders_date ON public.reminders(reminder_date);
-- Enable Row Level Security
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
-- Create RLS policies
CREATE POLICY "Allow read access to reminders" ON public.reminders FOR
SELECT USING (true);
CREATE POLICY "Allow insert access to reminders" ON public.reminders FOR
INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to reminders" ON public.reminders FOR
UPDATE USING (true);
CREATE POLICY "Allow delete access to reminders" ON public.reminders FOR DELETE USING (true);
-- Add endDate column to subscriptions table if it doesn't exist
DO $$ BEGIN IF NOT EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'subscriptions'
    AND column_name = 'endDate'
) THEN
ALTER TABLE public.subscriptions
ADD COLUMN "endDate" DATE;
END IF;
END $$;