# 🔧 Environment Variables Setup

## **Why you're not receiving emails:**

The reminder system is working, but you need to configure your environment variables!

## **Required Environment Variables:**

Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Resend Email Service
RESEND_API_KEY=your_resend_api_key_here
```

## **How to get these values:**

### **1. Supabase Setup:**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing
3. Go to Settings → API
4. Copy your Project URL and anon/public key

### **2. Resend Setup:**

1. Go to [resend.com](https://resend.com)
2. Sign up for an account
3. Go to API Keys section
4. Create a new API key
5. Copy the API key

### **3. Database Setup:**

Make sure you have the required tables:

- `subscriptions` table with columns: id, nameOfSubscription, periodicity, amount, currency, renewalDate, reminderOne, reminderTwo, reminderThree, category, paidFor, provider, note
- `users` table with columns: id, email, name

### **4. Test Data:**

Add some test subscriptions to your database with:

- `renewalDate` set to today or tomorrow
- `reminderOne`, `reminderTwo`, `reminderThree` set to values like "1 day before", "1 week before"
- `paidFor` pointing to a valid user ID

## **After Setup:**

1. Restart your development server: `npm run dev`
2. Test the reminder system: `curl "http://localhost:3000/api/scheduler/subscription-reminders?manual=true"`
3. Check your email!

## **Troubleshooting:**

- Check server logs for any errors
- Verify your Resend API key is valid
- Ensure your Supabase connection is working
- Make sure you have test data in your database
