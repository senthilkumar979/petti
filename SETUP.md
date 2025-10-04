# Petti Setup Guide

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up Supabase:**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Run the SQL script from `supabase-setup.sql` in the SQL Editor

3. **Configure environment variables:**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## First Time Setup

When you first visit the application:

1. If no users exist in the database, you'll see the admin setup page
2. Fill in your admin details (name, email, password)
3. Complete the setup to create the first admin user
4. After setup, you'll see the users list page

## Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    picture TEXT,
    addedOn TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    lastUpdated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    addedBy UUID REFERENCES public.users(id),
    updatedBy UUID REFERENCES public.users(id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Allow read access to all users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Allow users to update their own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_added_on ON public.users(addedOn);
```

## Troubleshooting

- **Build errors**: Make sure all environment variables are set
- **Database errors**: Ensure the SQL script has been run in Supabase
- **Authentication issues**: Check that RLS policies are correctly configured

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
