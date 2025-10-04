# Subscriptions Feature

This document describes the Subscriptions feature implementation in the Petti application.

## Overview

The Subscriptions feature allows users to manage their recurring subscriptions and expenses. Users can add, edit, delete, and view their subscriptions with detailed information including renewal dates, amounts, categories, and reminder settings.

## Features

### 1. Subscription Management

- **Add Subscriptions**: Create new subscriptions with comprehensive details
- **Edit Subscriptions**: Update existing subscription information
- **Delete Subscriptions**: Remove subscriptions with confirmation
- **View Subscriptions**: Display all subscriptions in a clean, organized list

### 2. Form Fields

- **Subscription Name**: Text input for the subscription name
- **Periodicity**: Dropdown with options (Monthly, Quarterly, Half-yearly, Annual, Bi-annual)
- **Amount**: Number input for the subscription cost
- **Currency**: Dropdown with 100+ currency options
- **Renewal Date**: Date picker for the next renewal date
- **Reminder Settings**: Three reminder dropdowns (1 day before, 2 days before, 3 days before, 1 week before, 10 days before)
- **Category**: Dropdown populated from subscription-categories table
- **Paid For**: Dropdown populated from users table

### 3. Auto-populated Fields

- **Last Modified**: Automatically set to current timestamp
- **Modified By**: Automatically set to current user ID
- **Created At**: Automatically set when subscription is created
- **Updated At**: Automatically updated when subscription is modified

## Database Schema

### Subscriptions Table

```sql
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY,
    nameOfSubscription TEXT NOT NULL,
    periodicity TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL,
    renewalDate DATE NOT NULL,
    reminderOne TEXT NOT NULL,
    reminderTwo TEXT NOT NULL,
    reminderThree TEXT NOT NULL,
    category TEXT NOT NULL,
    paidFor TEXT NOT NULL,
    lastModified TIMESTAMP WITH TIME ZONE,
    modifiedBy TEXT NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE,
    updatedAt TIMESTAMP WITH TIME ZONE
);
```

### Subscription Categories Table

```sql
CREATE TABLE public.subscription_categories (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    createdAt TIMESTAMP WITH TIME ZONE,
    updatedAt TIMESTAMP WITH TIME ZONE
);
```

## Components

### 1. SubscriptionForm (`src/components/templates/SubscriptionForm.tsx`)

- Comprehensive form with all required fields
- Form validation with error handling
- Support for both create and edit modes
- Currency dropdown with 100+ options
- Dynamic category and user dropdowns

### 2. SubscriptionList (`src/components/templates/SubscriptionList.tsx`)

- Displays subscriptions in card format
- Shows subscription status (Active, Expiring Soon, Expired)
- Color-coded badges for periodicity and reminders
- Edit and delete actions for each subscription
- Search and filter functionality

### 3. SubscriptionsPage (`src/app/subscriptions/page.tsx`)

- Main page component integrating all features
- Drawer for add/edit forms
- Delete confirmation modal
- Search functionality
- Error handling and loading states

### 4. Select Component (`src/components/atoms/Select.tsx`)

- Reusable select component for dropdowns
- Consistent styling with other form components
- Error state support
- Accessibility features

## API Functions

The following functions are added to the auth context:

- `fetchSubscriptions()`: Get all subscriptions
- `createSubscription(data)`: Create a new subscription
- `updateSubscription(id, data)`: Update an existing subscription
- `deleteSubscription(id)`: Delete a subscription
- `fetchSubscriptionCategories()`: Get all subscription categories

## Setup Instructions

1. **Database Setup**: Run the `subscriptions-setup.sql` script in your Supabase SQL editor
2. **Environment Variables**: Ensure your Supabase environment variables are configured
3. **Navigation**: The subscriptions page is accessible at `/subscriptions`

## Usage

1. **Adding a Subscription**:

   - Click the "Add Subscription" button
   - Fill in the form with subscription details
   - Select appropriate category and user
   - Set reminder preferences
   - Click "Save Subscription"

2. **Editing a Subscription**:

   - Click the edit button on any subscription card
   - Modify the desired fields
   - Click "Save Subscription"

3. **Deleting a Subscription**:

   - Click the delete button on any subscription card
   - Confirm the deletion in the modal

4. **Searching Subscriptions**:
   - Use the search bar to filter by name, category, or periodicity

## Styling and Design

- Follows the existing design system with Tailwind CSS
- Uses the established color palette and typography
- Responsive design for mobile and desktop
- Consistent with other pages in the application
- Clean, modern interface with proper spacing and hierarchy

## Error Handling

- Form validation with clear error messages
- API error handling with user-friendly messages
- Loading states for better user experience
- Graceful handling of missing data

## Future Enhancements

- Export subscriptions to CSV/PDF
- Recurring payment tracking
- Budget alerts and notifications
- Subscription analytics and insights
- Bulk operations (import/export)
- Advanced filtering and sorting options
