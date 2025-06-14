# Email Setup Guide

This document explains how to set up email functionality for password reset in the application.

## Current Status

The password reset functionality is implemented but emails are currently logged to the console for development purposes. To enable actual email sending, you need to:

## 1. Choose an Email Service Provider

### Recommended Options:

- **Resend** (Recommended for modern apps): https://resend.com
- **SendGrid**: https://sendgrid.com
- **Nodemailer with Gmail/SMTP**
- **Amazon SES**

## 2. Environment Variables

Add these environment variables to your `.env` file:

```env
# For Resend
RESEND_API_KEY=your_resend_api_key

# For SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# For SMTP (Gmail/Outlook)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 3. Update the Forgot Password API

Currently in `src/app/api/auth/forgot-password/route.ts`, emails are logged to console:

```typescript
// TODO: Send email with reset link
console.log('Password reset link:', resetUrl);
```

### For Resend:

1. Install Resend:
```bash
npm install resend
```

2. Replace the TODO section with:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@yourdomain.com',
  to: email,
  subject: 'Password Reset Request',
  html: `
    <h2>Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `,
});
```

### For SendGrid:

1. Install SendGrid:
```bash
npm install @sendgrid/mail
```

2. Replace the TODO section with:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: email,
  from: 'noreply@yourdomain.com',
  subject: 'Password Reset Request',
  html: `
    <h2>Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `,
});
```

## 4. Domain Configuration

For production, make sure to:

1. Set up SPF, DKIM, and DMARC records for your domain
2. Verify your sending domain with your email provider
3. Update `NEXTAUTH_URL` environment variable with your production URL

## 5. Testing

1. Start your database server
2. Run the migration: `npx prisma migrate dev --name add_password_reset_fields`
3. Test the password reset flow:
   - Go to `/login`
   - Click "Forgot Password"
   - Enter an email address
   - Check console logs for the reset link (or your inbox if email is configured)
   - Visit the reset link to set a new password

## Security Notes

- Reset tokens expire after 1 hour
- Tokens are cryptographically secure (32 bytes of random data)
- The API doesn't reveal whether an email exists in the system (prevents enumeration attacks)
- Old reset tokens are cleared when a new password is set