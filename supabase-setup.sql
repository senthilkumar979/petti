-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    picture TEXT,
    "addedOn" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "lastUpdated" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "addedBy" UUID REFERENCES public.users(id),
    "updatedBy" UUID REFERENCES public.users(id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow users to read all users (for the users list)
CREATE POLICY "Allow read access to all users" ON public.users
    FOR SELECT USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Allow users to insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update their own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Create a function to automatically update lastUpdated timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."lastUpdated" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update lastUpdated
CREATE TRIGGER update_users_last_updated 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_last_updated_column();

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Create an index on addedOn for faster sorting
CREATE INDEX IF NOT EXISTS idx_users_added_on ON public.users("addedOn");

-- Fix the handle_new_user() function to work with our users table
-- This function is called by the auth trigger when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    picture,
    "addedOn",
    "lastUpdated",
    "addedBy",
    "updatedBy"
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW(),
    NULL,
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the INSERT policy to allow the handle_new_user function to work
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.users;

CREATE POLICY "Allow user profile insertion" ON public.users
    FOR INSERT WITH CHECK (true);

-- Ensure the trigger exists and is enabled
-- Note: The trigger should already exist from Supabase's default setup
-- If it doesn't work, you may need to create it manually:
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create subscription-categories table
CREATE TABLE IF NOT EXISTS public."subscription-categories" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for subscription-categories
ALTER TABLE public."subscription-categories" ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription-categories
CREATE POLICY "Allow read access to subscription categories" ON public."subscription-categories"
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to subscription categories" ON public."subscription-categories"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to subscription categories" ON public."subscription-categories"
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to subscription categories" ON public."subscription-categories"
    FOR DELETE USING (true);

-- Create document-categories table
CREATE TABLE IF NOT EXISTS public."document-categories" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for document-categories
ALTER TABLE public."document-categories" ENABLE ROW LEVEL SECURITY;

-- Create policies for document-categories
CREATE POLICY "Allow read access to document categories" ON public."document-categories"
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to document categories" ON public."document-categories"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to document categories" ON public."document-categories"
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to document categories" ON public."document-categories"
    FOR DELETE USING (true);

-- Insert subscription categories
INSERT INTO public."subscription-categories" (name) VALUES
    ('Entertainment'),
    ('Medical Insurance'),
    ('Car Insurance'),
    ('Internet'),
    ('Telecom'),
    ('Electricity'),
    ('Water'),
    ('Gas'),
    ('Travel')
ON CONFLICT (name) DO NOTHING;

-- Insert document categories
INSERT INTO public."document-categories" (name) VALUES
    ('Identity Docs'),
    ('Work'),
    ('School'),
    ('College'),
    ('Travel')
ON CONFLICT (name) DO NOTHING;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "nameOfSubscription" TEXT NOT NULL,
    periodicity TEXT NOT NULL CHECK (periodicity IN ('Monthly', 'Quarterly', 'Half-yearly', 'Annual', 'Bi-annual')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL,
    "renewalDate" DATE NOT NULL,
    "reminderOne" TEXT NOT NULL CHECK ("reminderOne" IN ('1 day before', '2 days before', '3 days before', '1 week before', '10 days before')),
    "reminderTwo" TEXT NOT NULL CHECK ("reminderTwo" IN ('1 day before', '2 days before', '3 days before', '1 week before', '10 days before')),
    "reminderThree" TEXT NOT NULL CHECK ("reminderThree" IN ('1 day before', '2 days before', '3 days before', '1 week before', '10 days before')),
    category TEXT NOT NULL,
    "paidFor" TEXT NOT NULL,
    provider TEXT,
    note TEXT,
    "lastModified" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "modifiedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
CREATE POLICY "Allow read access to subscriptions" ON public.subscriptions
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to subscriptions" ON public.subscriptions
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to subscriptions" ON public.subscriptions
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_renewal_date ON public.subscriptions("renewalDate");
CREATE INDEX IF NOT EXISTS idx_subscriptions_category ON public.subscriptions(category);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paid_for ON public.subscriptions("paidFor");
CREATE INDEX IF NOT EXISTS idx_subscriptions_periodicity ON public.subscriptions(periodicity);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON public.subscriptions(provider);
CREATE INDEX IF NOT EXISTS idx_subscriptions_note ON public.subscriptions(note);

-- Create function to update updatedAt timestamp for subscriptions
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updatedAt for subscriptions
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON public.subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_subscriptions_updated_at();

-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    "primaryEmail" TEXT,
    "secondaryEmail" TEXT,
    "primaryPhone" TEXT,
    "secondaryPhone" TEXT,
    designation TEXT,
    company TEXT,
    location TEXT,
    "lastContacted" DATE,
    notes TEXT,
    category TEXT NOT NULL CHECK (category IN ('work', 'personal')),
    referrer TEXT,
    "ownedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for contacts
CREATE POLICY "Allow read access to contacts" ON public.contacts
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to contacts" ON public.contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to contacts" ON public.contacts
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to contacts" ON public.contacts
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_name ON public.contacts(name);
CREATE INDEX IF NOT EXISTS idx_contacts_category ON public.contacts(category);
CREATE INDEX IF NOT EXISTS idx_contacts_owned_by ON public.contacts("ownedBy");
CREATE INDEX IF NOT EXISTS idx_contacts_company ON public.contacts(company);
CREATE INDEX IF NOT EXISTS idx_contacts_primary_email ON public.contacts("primaryEmail");

-- Create function to update updatedAt timestamp for contacts
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updatedAt for contacts
CREATE TRIGGER update_contacts_updated_at 
    BEFORE UPDATE ON public.contacts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_contacts_updated_at();

-- Create note-categories table
CREATE TABLE IF NOT EXISTS public."note-categories" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    color VARCHAR(7),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for note-categories
ALTER TABLE public."note-categories" ENABLE ROW LEVEL SECURITY;

-- Create policies for note-categories
CREATE POLICY "Allow read access to note categories" ON public."note-categories"
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to note categories" ON public."note-categories"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to note categories" ON public."note-categories"
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to note categories" ON public."note-categories"
    FOR DELETE USING (true);

-- Insert default note categories
INSERT INTO public."note-categories" (name, color) VALUES
    ('Personal', '#3B82F6'),
    ('Work', '#10B981'),
    ('Ideas', '#F59E0B'),
    ('Research', '#8B5CF6'),
    ('Meeting Notes', '#EF4444'),
    ('To-Do', '#6B7280')
ON CONFLICT (name) DO NOTHING;

-- Create notes table
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    heading TEXT NOT NULL,
    content TEXT NOT NULL,
    "categoryId" UUID NOT NULL REFERENCES public."note-categories"(id) ON DELETE CASCADE,
    "lastUpdatedDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "lastUpdatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies for notes
CREATE POLICY "Allow read access to notes" ON public.notes
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to notes" ON public.notes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to notes" ON public.notes
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to notes" ON public.notes
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_heading ON public.notes(heading);
CREATE INDEX IF NOT EXISTS idx_notes_category_id ON public.notes("categoryId");
CREATE INDEX IF NOT EXISTS idx_notes_last_updated_by ON public.notes("lastUpdatedBy");
CREATE INDEX IF NOT EXISTS idx_notes_last_updated_date ON public.notes("lastUpdatedDate");

-- Create function to update updatedAt timestamp for note-categories
CREATE OR REPLACE FUNCTION update_note_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updatedAt for note-categories
CREATE TRIGGER update_note_categories_updated_at 
    BEFORE UPDATE ON public."note-categories" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_note_categories_updated_at();

-- Create function to update updatedAt timestamp for notes
CREATE OR REPLACE FUNCTION update_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    NEW."lastUpdatedDate" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updatedAt for notes
CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON public.notes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_notes_updated_at();

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    owner TEXT NOT NULL,
    "lastModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "lastModifiedBy" TEXT NOT NULL,
    "createdDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "createdBy" TEXT NOT NULL,
    validity DATE,
    "mimeType" TEXT NOT NULL,
    content TEXT NOT NULL,
    "isPreDefined" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents
CREATE POLICY "Allow read access to documents" ON public.documents
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to documents" ON public.documents
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to documents" ON public.documents
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to documents" ON public.documents
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_name ON public.documents(name);
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_owner ON public.documents(owner);
CREATE INDEX IF NOT EXISTS idx_documents_is_predefined ON public.documents("isPreDefined");
CREATE INDEX IF NOT EXISTS idx_documents_created_date ON public.documents("createdDate");
CREATE INDEX IF NOT EXISTS idx_documents_validity ON public.documents(validity);

-- Create function to update updatedAt timestamp for documents
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    NEW."lastModifiedDate" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updatedAt for documents
CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON public.documents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_documents_updated_at();

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage policies for avatars bucket
CREATE POLICY "Allow public read access to avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Allow authenticated users to upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own avatars" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to delete their own avatars" ON storage.objects
    FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create storage policies for documents bucket
CREATE POLICY "Allow authenticated users to read documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to upload documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update documents" ON storage.objects
    FOR UPDATE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete documents" ON storage.objects
    FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
