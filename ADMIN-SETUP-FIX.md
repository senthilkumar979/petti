# Admin Setup Fix Guide

## Problem

Getting "Database error saving new user" when trying to create the first admin user.

## Root Cause

Row Level Security (RLS) policies are preventing the first user from being created because the user isn't fully authenticated when we try to create their profile.

## Solution Steps

### Step 1: Temporarily Disable RLS

Run this in your Supabase SQL Editor:

```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

### Step 2: Create Your First Admin User

1. Go to your application at http://localhost:3001
2. Fill out the admin setup form
3. Submit the form to create your first admin user
4. This should now work without RLS blocking it

### Step 3: Re-enable RLS with Proper Policies

After creating your first user, run this in Supabase SQL Editor:

```sql
-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create proper policies
CREATE POLICY "Allow read access to all users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Allow user profile insertion" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Allow users to update their own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);
```

### Step 4: Test the Application

1. Refresh your application
2. You should now see the users list page
3. The admin setup should be complete

## Alternative Solution (If Step 1-3 doesn't work)

If you still have issues, try this more permissive approach:

```sql
-- Keep RLS enabled but use more permissive policies
DROP POLICY IF EXISTS "Allow read access to all users" ON public.users;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.users;

CREATE POLICY "Allow read access to all users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Allow user profile insertion" ON public.users
    FOR INSERT WITH CHECK (
        auth.uid()::text = id::text OR
        (SELECT COUNT(*) FROM public.users) = 0
    );

CREATE POLICY "Allow users to update their own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);
```

## What This Fixes

1. **First User Creation**: Allows the first admin user to be created
2. **Security**: Maintains proper RLS policies for subsequent users
3. **User Management**: Allows users to manage their own profiles
4. **Admin Access**: Allows reading all users for the admin dashboard

## After the Fix

Your application should work perfectly with:

- ✅ Admin setup completing successfully
- ✅ Users list displaying properly
- ✅ Proper security with RLS policies
- ✅ User authentication working correctly
