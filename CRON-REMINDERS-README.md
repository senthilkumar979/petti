# Daily Reminders CRON Job

This document describes the automated daily reminder email system that runs at 12 AM CET.

## Overview

The daily reminders CRON job automatically sends email notifications based on the `reminders` table. It runs every day at 12 AM CET (11 PM UTC) and checks for reminders where `reminder_date` matches the current date in CET timezone.

## How It Works

1. **CRON Schedule**: Runs daily at 11 PM UTC (which is 12 AM CET in winter, 1 AM CEST in summer)
2. **Date Check**: Converts current UTC time to CET/CEST timezone and gets the date
3. **Reminder Query**: Fetches all reminders from the `reminders` table where `reminder_date` matches today's date (CET)
4. **Email Sending**: For each matching reminder:
   - Fetches the subscription details
   - Finds the user who pays for the subscription
   - Sends an email reminder with subscription details
   - CC's all other users in the system

## API Endpoint

- **Route**: `/api/cron/daily-reminders`
- **Method**: GET
- **CRON Schedule**: `0 23 * * *` (11 PM UTC daily)

## Manual Testing

You can manually trigger the CRON job for testing:

```bash
# Using curl
curl -X GET "http://localhost:3000/api/cron/daily-reminders?manual=true"

# Or visit in browser
http://localhost:3000/api/cron/daily-reminders?manual=true
```

## Vercel Deployment

When deployed to Vercel, the CRON job is automatically configured via `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-reminders",
      "schedule": "0 23 * * *"
    }
  ]
}
```

## Security

For production, set a `CRON_SECRET` environment variable in Vercel:

1. Go to your Vercel project settings
2. Add environment variable: `CRON_SECRET=your-secret-key`
3. Vercel will automatically add this as the Authorization header when calling the CRON endpoint

## Timezone Handling

The system automatically handles CET/CEST timezone conversion:
- **CET (Winter)**: UTC+1 (October to March)
- **CEST (Summer)**: UTC+2 (April to September)

The code detects the current season and adjusts the timezone offset accordingly.

## Requirements

1. **SMTP Configuration**: Must be configured in the Email Settings page
2. **Reminders Table**: Must have reminders with `reminder_date` matching today's date
3. **Subscriptions**: Each reminder must have a valid `subscription_id` that exists in the subscriptions table
4. **Users**: Each subscription must have a valid `paidFor` user ID

## Logging

The CRON job logs detailed information:
- Number of reminders found for today
- Each reminder being processed
- Email sending results (success/failure)
- Final summary with counts

Check your Vercel function logs to monitor the CRON job execution.

