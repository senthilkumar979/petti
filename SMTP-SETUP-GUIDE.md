# 📧 SMTP Configuration Setup Guide

This guide will help you set up SMTP email configuration for your Petti subscription reminder system.

## 🚀 **Quick Start**

1. **Run the database setup:**

   ```sql
   -- Run this in your Supabase SQL Editor
   -- (Copy the contents of smtp-setup.sql)
   ```

2. **Navigate to Email Settings:**
   - Go to `/settings/email` in your application
   - Configure your SMTP settings
   - Test the configuration

3. **Test the reminder system:**
   ```bash
   curl "http://localhost:3000/api/scheduler/subscription-reminders?manual=true"
   ```

## 📋 **Supported Email Providers**

### **Gmail Setup**

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Configuration:**
   - **Host:** `smtp.gmail.com`
   - **Port:** `587`
   - **Security:** TLS (not SSL)
   - **Username:** Your Gmail address
   - **Password:** The app password (not your regular password)

### **Outlook/Hotmail Setup**

1. **Configuration:**
   - **Host:** `smtp-mail.outlook.com`
   - **Port:** `587`
   - **Security:** TLS
   - **Username:** Your Outlook email
   - **Password:** Your Outlook password

### **Zoho Mail Setup**

1. **Configuration:**
   - **Host:** `smtp.zoho.com`
   - **Port:** `587`
   - **Security:** TLS
   - **Username:** Your Zoho email
   - **Password:** Your Zoho password

### **Custom SMTP Setup**

1. **Get SMTP details from your email provider**
2. **Common settings:**
   - **Host:** Your SMTP server
   - **Port:** Usually 587 (TLS) or 465 (SSL)
   - **Security:** TLS or SSL
   - **Username:** Your email address
   - **Password:** Your email password

## 🔧 **Configuration Steps**

### **Step 1: Database Setup**

Run the SQL script in your Supabase SQL Editor:

```sql
-- (Contents of smtp-setup.sql)
```

### **Step 2: Configure SMTP**

1. Navigate to `/settings/email`
2. Select your email provider
3. Fill in the required fields:
   - **SMTP Host:** Your email provider's SMTP server
   - **Port:** Usually 587 for TLS
   - **Security:** Check "Use SSL/TLS" if required
   - **Username:** Your email address
   - **Password:** Your email password or app password
   - **From Name:** Display name for emails
   - **From Email:** The email address to send from

### **Step 3: Test Configuration**

1. Enter a test email address
2. Click "Send Test Email"
3. Check your inbox for the test email
4. If successful, your configuration is working!

### **Step 4: Save Configuration**

1. Click "Save Configuration"
2. Your SMTP settings will be stored in the database
3. The reminder system will now use your SMTP configuration

## 🧪 **Testing the System**

### **Manual Test**

```bash
curl "http://localhost:3000/api/scheduler/subscription-reminders?manual=true"
```

### **Check Logs**

Look for these messages in your server logs:

- `✅ SMTP configuration loaded successfully`
- `Reminder email sent successfully for subscription [ID]`

### **Expected Behavior**

- If SMTP is configured: Emails will be sent using your SMTP settings
- If no SMTP configuration: Error message about missing SMTP configuration

## 🔍 **Troubleshooting**

### **Common Issues**

#### **"SMTP connection failed"**

- Check your email and password
- Verify the SMTP host and port
- Ensure 2FA is enabled for Gmail and use App Password

#### **"Authentication failed"**

- For Gmail: Use App Password, not regular password
- For other providers: Check username/password
- Ensure the account has SMTP access enabled

#### **"Connection timeout"**

- Check your internet connection
- Verify the SMTP host and port
- Try different security settings (TLS vs SSL)

#### **"No SMTP configuration found"**

- Make sure you've saved the SMTP configuration
- Check that the configuration is marked as active
- Restart your application if needed

### **Gmail Specific Issues**

#### **"Username and Password not accepted"**

- Enable 2-Factor Authentication
- Generate an App Password
- Use the App Password, not your regular password

#### **"Less secure app access"**

- This is no longer supported by Google
- Use App Passwords instead

### **Debug Steps**

1. **Check Configuration:**

   ```bash
   curl "http://localhost:3000/api/smtp/config"
   ```

2. **Test SMTP Connection:**

   ```bash
   curl -X POST "http://localhost:3000/api/smtp/test" \
     -H "Content-Type: application/json" \
     -d '{"config": {...}, "testEmail": "your-email@example.com"}'
   ```

3. **Check Server Logs:**
   - Look for SMTP-related error messages
   - Check if configuration is being loaded

## 📚 **API Endpoints**

### **Get SMTP Configuration**

```bash
GET /api/smtp/config
```

### **Save SMTP Configuration**

```bash
POST /api/smtp/config
Content-Type: application/json

{
  "provider": "gmail",
  "host": "smtp.gmail.com",
  "port": 587,
  "secure": false,
  "username": "your-email@gmail.com",
  "password": "your-app-password",
  "fromName": "Petti Subscriptions",
  "fromEmail": "noreply@yourdomain.com"
}
```

### **Test SMTP Configuration**

```bash
POST /api/smtp/test
Content-Type: application/json

{
  "config": { ... },
  "testEmail": "test@example.com"
}
```

### **Delete SMTP Configuration**

```bash
DELETE /api/smtp/config
```

## 🎯 **Production Considerations**

### **Security**

- Store SMTP credentials securely
- Use environment variables for sensitive data
- Consider using a dedicated email service for production

### **Reliability**

- Test your SMTP configuration regularly
- Have a backup email provider
- Monitor email delivery rates

### **Scalability**

- Consider using a professional email service (SendGrid, Mailgun, etc.)
- Implement email queuing for high volumes
- Monitor SMTP rate limits

## 🆘 **Support**

If you encounter issues:

1. **Check the server logs** for detailed error messages
2. **Verify your SMTP settings** with your email provider
3. **Test with a simple email client** (like Thunderbird) first
4. **Contact your email provider** for SMTP-specific issues

## 📝 **Notes**

- **Gmail:** Requires App Password for SMTP access
- **Outlook:** Usually works with regular credentials
- **Zoho:** Check if SMTP is enabled in your account settings
- **Custom:** Verify SMTP settings with your email provider

The SMTP configuration system allows you to use any email provider that supports SMTP, giving you full control over your email delivery without being tied to a specific service like Resend.
