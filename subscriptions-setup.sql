-- Subscriptions table setup
-- Run this SQL script in your Supabase SQL editor to create the necessary tables

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nameOfSubscription TEXT NOT NULL,
    periodicity TEXT NOT NULL CHECK (periodicity IN ('Monthly', 'Quarterly', 'Half-yearly', 'Annual', 'Bi-annual')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL,
    renewalDate DATE NOT NULL,
    reminderOne TEXT NOT NULL CHECK (reminderOne IN ('1 day before', '2 days before', '3 days before', '1 week before', '10 days before')),
    reminderTwo TEXT NOT NULL CHECK (reminderTwo IN ('1 day before', '2 days before', '3 days before', '1 week before', '10 days before')),
    reminderThree TEXT NOT NULL CHECK (reminderThree IN ('1 day before', '2 days before', '3 days before', '1 week before', '10 days before')),
    category TEXT NOT NULL,
    paidFor TEXT NOT NULL,
    lastModified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modifiedBy TEXT NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription-categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subscription_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default categories
INSERT INTO public.subscription_categories (name) VALUES 
    ('Entertainment'),
    ('Software'),
    ('Cloud Services'),
    ('Utilities'),
    ('Insurance'),
    ('Memberships'),
    ('News & Media'),
    ('Education'),
    ('Health & Fitness'),
    ('Other')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions table
CREATE POLICY "Users can view all subscriptions" ON public.subscriptions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update subscriptions" ON public.subscriptions
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete subscriptions" ON public.subscriptions
    FOR DELETE USING (true);

-- Create RLS policies for subscription_categories table
CREATE POLICY "Users can view all subscription categories" ON public.subscription_categories
    FOR SELECT USING (true);

CREATE POLICY "Users can insert subscription categories" ON public.subscription_categories
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update subscription categories" ON public.subscription_categories
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete subscription categories" ON public.subscription_categories
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_renewal_date ON public.subscriptions(renewalDate);
CREATE INDEX IF NOT EXISTS idx_subscriptions_category ON public.subscriptions(category);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paid_for ON public.subscriptions(paidFor);
CREATE INDEX IF NOT EXISTS idx_subscriptions_periodicity ON public.subscriptions(periodicity);
CREATE INDEX IF NOT EXISTS idx_subscription_categories_name ON public.subscription_categories(name);

-- Create function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updatedAt
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON public.subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_categories_updated_at 
    BEFORE UPDATE ON public.subscription_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
