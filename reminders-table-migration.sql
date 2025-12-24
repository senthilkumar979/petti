-- Create reminders table for subscription reminders
-- Run this SQL script in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscriptionId UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    reminderDate DATE NOT NULL,
    reminderType TEXT NOT NULL CHECK (reminderType IN ('reminderOne', 'reminderTwo', 'reminderThree', 'renewal')),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on subscriptionId for faster lookups
CREATE INDEX IF NOT EXISTS idx_reminders_subscription_id ON public.reminders(subscriptionId);

-- Create index on reminderDate for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_reminders_date ON public.reminders(reminderDate);

-- Enable Row Level Security
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reminders table
CREATE POLICY "Allow read access to reminders" ON public.reminders FOR
SELECT USING (true);

CREATE POLICY "Allow insert access to reminders" ON public.reminders FOR
INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to reminders" ON public.reminders FOR
UPDATE USING (true);

CREATE POLICY "Allow delete access to reminders" ON public.reminders FOR DELETE USING (true);

-- Add endDate column to subscriptions table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'subscriptions' 
        AND column_name = 'endDate'
    ) THEN
        ALTER TABLE public.subscriptions ADD COLUMN "endDate" DATE;
    END IF;
END $$;

