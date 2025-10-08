# Subscription Reminders Feature

This document describes the automated subscription reminder email system implemented in the Petti application.

## Overview

The subscription reminder system automatically sends email notifications to users about upcoming subscription renewals based on their configured reminder preferences. The system runs daily at 12:00 AM and checks all subscriptions for upcoming renewals.

## Features

### 1. Automated Daily Processing

- **CRON Job**: Runs daily at 12:00 AM (midnight)
- **Automatic Processing**: Checks all subscriptions for upcoming renewals
- **Smart Calculation**: Calculates next renewal dates based on subscription periodicity

### 2. Reminder Logic

- **Multiple Reminders**: Supports up to 3 different reminder settings per subscription
- **Flexible Timing**: Reminders can be sent 1, 2, 3, 7, or 10 days before renewal
- **Periodicity Support**: Handles Monthly, Quarterly, Half-yearly, Annual, and Bi-annual subscriptions

### 3. Email Notifications

- **Primary Recipient**: Email sent to the user who pays for the subscription (`paidFor` field)
- **CC Recipients**: All other users in the system are CC'd on the reminder emails
- **Professional Template**: Clean, responsive HTML email template with subscription details

## Technical Implementation

### API Endpoint

- **Route**: `/api/scheduler/subscription-reminders`
- **Methods**: GET (status check), POST (manual trigger)
- **Manual Trigger**: Use `?manual=true` query parameter for testing

### Dependencies

- **Resend**: Email delivery service
- **node-cron**: CRON job scheduling
- **Supabase**: Database operations

### Environment Variables Required

```env
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install nodemailer @types/nodemailer
```

### 2. Configure SMTP Settings

Configure your SMTP settings in the application's Email Settings page:

1. **Go to Settings → Email Settings**
2. **Select your email provider** (Gmail, Outlook, Zoho, or Custom)
3. **Enter your SMTP credentials**
4. **Test the configuration**
5. **Save the settings**

### 3. SMTP Provider Setup

**For Gmail:**

1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the App Password in SMTP settings

**For Outlook:**

1. Use your regular email credentials
2. SMTP: smtp-mail.outlook.com, Port: 587

**For Zoho:**

1. Use your regular email credentials
2. SMTP: smtp.zoho.com, Port: 587

### 4. Deploy and Test

The CRON job will automatically start when the application is deployed. For testing, you can:

- Visit `/api/scheduler/subscription-reminders?manual=true` to trigger manually
- Send a POST request to `/api/scheduler/subscription-reminders` to trigger processing

## How It Works

### 1. Daily Processing

Every day at 12:00 AM, the system:

1. Fetches all subscriptions from the database
2. Calculates the next renewal date for each subscription based on its periodicity
3. Checks if any reminders should be sent today based on the reminder settings
4. Sends email notifications to the appropriate users

### 2. Renewal Date Calculation

The system calculates the next renewal date by adding the appropriate time period to the current renewal date:

- **Monthly**: +1 month
- **Quarterly**: +3 months
- **Half-yearly**: +6 months
- **Annual**: +1 year
- **Bi-annual**: +2 years

### 3. Reminder Timing

The system checks if today matches any of the configured reminder days:

- If a subscription has a renewal date of March 15th
- And has a "3 days before" reminder setting
- The reminder will be sent on March 12th

### 4. Email Delivery

- **From**: Petti Subscriptions <noreply@petti.app>
- **To**: The user who pays for the subscription
- **CC**: All other users in the system
- **Subject**: 🔔 Subscription Reminder: [Subscription Name]

## Email Template

The email includes:

- Professional header with gradient background
- Subscription details (name, amount, renewal date, periodicity, category)
- Provider and note information (if available)
- Friendly reminder message
- Clean, responsive design

## Testing

### Manual Testing

1. **Trigger Manually**: Visit `/api/scheduler/subscription-reminders?manual=true`
2. **Check Logs**: Monitor console output for processing details
3. **Verify Emails**: Check that emails are sent to the correct recipients

### Test Data Setup

To test the system:

1. Create subscriptions with renewal dates in the near future
2. Set reminder preferences to "1 day before" for quick testing
3. Trigger the manual endpoint to process reminders

## Monitoring

### Logs

The system logs:

- Daily processing start
- Number of reminders processed
- Email delivery success/failure
- Error messages for troubleshooting

### Error Handling

- Database connection errors
- Email delivery failures
- Invalid subscription data
- Missing user information

## Customization

### Email Template

The email template can be customized in the `createEmailTemplate` function in `/api/scheduler/subscription-reminders/route.ts`.

### Reminder Timing

The CRON schedule can be modified in the same file:

```typescript
// Current: Daily at 12:00 AM
cron.schedule("0 0 * * *", () => {
  // Process reminders
});

// Example: Every 6 hours
cron.schedule("0 */6 * * *", () => {
  // Process reminders
});
```

### Email Settings

Email settings can be customized:

- From address
- Subject line format
- CC recipients logic
- Email template styling

## Troubleshooting

### Common Issues

1. **Emails Not Sending**

   - Check RESEND_API_KEY is set correctly
   - Verify Resend account is active
   - Check console logs for error messages

2. **CRON Job Not Running**

   - Ensure the application is running continuously
   - Check server logs for CRON job initialization
   - Verify node-cron is properly installed

3. **Wrong Reminder Dates**

   - Check subscription renewal dates in database
   - Verify periodicity calculations
   - Test with manual trigger

4. **Missing Users**
   - Ensure all subscription `paidFor` fields reference valid user IDs
   - Check users table has required email addresses

### Debug Mode

Enable detailed logging by adding console.log statements in the processing function to track:

- Subscription data retrieval
- Renewal date calculations
- Reminder timing checks
- Email sending attempts

## Security Considerations

- **API Key Protection**: Keep RESEND_API_KEY secure and never commit to version control
- **Rate Limiting**: Resend has rate limits; monitor usage in production
- **Email Validation**: Ensure all user emails are valid before sending
- **Access Control**: The API endpoint should be protected in production environments

## Future Enhancements

Potential improvements:

- **Email Templates**: Multiple template options
- **User Preferences**: Allow users to customize reminder settings
- **SMS Notifications**: Add SMS as an alternative to email
- **Advanced Scheduling**: More flexible reminder timing options
- **Analytics**: Track email open rates and user engagement
- **Unsubscribe**: Allow users to opt out of certain reminder types
