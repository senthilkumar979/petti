-- Completely disable RLS to allow first user creation
-- Run this in your Supabase SQL Editor

-- Step 1: Disable RLS completely
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- Step 3: After creating your first user, you can re-enable RLS with:
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow read access to all users" ON public.users
--     FOR SELECT USING (true);
-- 
-- CREATE POLICY "Allow user profile insertion" ON public.users
--     FOR INSERT WITH CHECK (auth.uid()::text = id::text);
-- 
-- CREATE POLICY "Allow users to update their own profile" ON public.users
--     FOR UPDATE USING (auth.uid()::text = id::text);
