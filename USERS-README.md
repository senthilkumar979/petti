# Users Management Feature

This document describes the new Users management feature added to the Settings page.

## Overview

The Users tab allows administrators to invite new team members to the organization. Users can be invited with their email, name, and optional profile picture.

## Features

### 1. Users Tab

- **Location**: Settings page, first tab
- **Purpose**: Manage team members and invitations
- **Components**: Users list and invitation form

### 2. User Invitation Form

- **Access**: Via "Invite User" button in Users tab
- **Modal**: Right-side drawer using Vaul drawer component
- **Fields**:
  - **Email**: Required, must be unique
  - **Name**: Required, minimum 2 characters
  - **Picture**: Optional, max 2MB, supports JPG/PNG/GIF

### 3. Avatar Component

- **Library**: Radix UI Avatar
- **Features**:
  - Image display with fallback to initials
  - Responsive sizing
  - Error handling for broken images

### 4. Users List

- **Display**: Card-based layout showing all users
- **Information**:
  - Profile picture or initials
  - Name and email
  - Join date
  - Active status
- **Empty State**: Helpful message with call-to-action

## Technical Implementation

### Components Created

1. `Avatar.tsx` - Radix UI Avatar component with fallback
2. `UserInviteForm.tsx` - Form with validation and file upload
3. `UsersList.tsx` - Display component for user list
4. `useUsers.ts` - Custom hook for user management

### API Integration

- **Endpoint**: `/api/invite-user`
- **Method**: POST
- **Purpose**: Handle email invitations (placeholder implementation)

### Database Schema

- **Table**: `users`
- **Storage**: `avatars` bucket for profile pictures
- **Validation**: Email uniqueness enforced

### File Upload

- **Storage**: Supabase Storage
- **Bucket**: `avatars`
- **Validation**: 2MB size limit
- **Formats**: JPG, PNG, GIF

## Email Integration

### Current Implementation

The email functionality is currently a placeholder that logs to console. In production, you would:

1. **Invitation Email**: Send to the invited user with:

   - Welcome message
   - Registration link
   - Inviter information

2. **Notification Email**: Send to the inviter with:
   - Confirmation that invitation was sent
   - Invited user details

### Production Setup

To implement real email functionality:

1. Choose an email service (SendGrid, Resend, AWS SES)
2. Update the `/api/invite-user` route
3. Create email templates
4. Add environment variables for API keys

## Usage

1. Navigate to Settings page
2. Click on "Users" tab (first tab)
3. Click "Invite User" button
4. Fill in the form:
   - Enter user's email and name
   - Optionally upload a profile picture
5. Click "Send Invitation"
6. User will be added to the database
7. Emails will be triggered (currently logged to console)

## Validation

- **Email**: Must be valid format and unique
- **Name**: Required, minimum 2 characters
- **Picture**: Optional, max 2MB, image formats only
- **File Size**: Enforced client-side and server-side

## Security

- **RLS**: Row Level Security enabled on users table
- **Storage**: Public read access for avatars, authenticated upload
- **Validation**: Server-side validation for all inputs
- **File Upload**: Secure file handling with size limits

## Future Enhancements

1. **Email Templates**: Professional email templates
2. **User Roles**: Different permission levels
3. **Bulk Invite**: Invite multiple users at once
4. **User Management**: Edit/delete user functionality
5. **Email Verification**: Track invitation status
6. **Audit Log**: Track user invitation history
