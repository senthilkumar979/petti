# Troubleshooting Admin Setup

## Current Issue: "Database error saving new user"

This error occurs because Row Level Security (RLS) is blocking the creation of the first user.

## Quick Fix (Recommended)

### Step 1: Check RLS Status

Run this in your Supabase SQL Editor:

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'users' AND schemaname = 'public';
```

### Step 2: Disable RLS Temporarily

If RLS is enabled (rowsecurity = true), run:

```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

### Step 3: Create Your First User

1. Go to http://localhost:3001
2. Fill out the admin setup form
3. Submit the form
4. This should now work!

### Step 4: Re-enable RLS

After creating your first user, run:

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

## Alternative: Debug Script

If you want to understand what's happening, run the debug script:

```bash
node debug-user-creation.js
```

This will show you:

- RLS status
- Current user count
- Authentication status
- Insert test results

## What Each Error Means

- **"Database error saving new user"** = RLS is blocking the insert
- **"No authenticated user found"** = User signup didn't complete properly
- **"Row Level Security is blocking user creation"** = RLS policies are too restrictive

## After the Fix

Once you complete the steps above:

1. ✅ Admin setup will work
2. ✅ You'll see the users list page
3. ✅ RLS will be properly configured
4. ✅ Future users can register normally

## Still Having Issues?

If you're still getting errors after following these steps:

1. Check the browser console for more detailed error messages
2. Run the debug script to see the exact issue
3. Make sure your Supabase environment variables are correct
4. Verify the database table structure matches the expected schema
