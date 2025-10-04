# Petti - Modern NextJS Application

A modern NextJS application with TypeScript, Tailwind CSS, and Supabase authentication.

## Features

- **Authentication**: Supabase-powered user authentication
- **Admin Setup**: One-time admin setup flow for first-time users
- **User Management**: View and manage registered users
- **Modern Stack**: NextJS 15, TypeScript, Tailwind CSS, Radix UI
- **Type Safety**: Full TypeScript support with strict typing

## Tech Stack

- **Framework**: NextJS 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: Supabase
- **State Management**: Jotai
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd petti
```

2. Install dependencies:

```bash
npm install
```

3. Set up Supabase:

   - Create a new Supabase project
   - Go to the SQL Editor in your Supabase dashboard
   - Run the SQL script from `supabase-setup.sql` to create the users table

4. Configure environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

5. **Important**: If you get a column name error (`column users.addedOn does not exist`), run the SQL script from `fix-column-names.sql` in your Supabase SQL Editor to fix the column names.

6. **RLS Policy Fix**: If you get a Row Level Security error (`new row violates row-level security policy`), run the SQL script from `update-rls-policies.sql` in your Supabase SQL Editor to fix the policies.

7. Run the development server:

```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## First Time Setup

When you first launch the application:

1. If no users exist in the database, you'll see the admin setup page
2. Fill in your admin details (name, email, password)
3. Complete the setup to create the first admin user
4. After setup, you'll see the users list page

## Database Schema

The application uses a `users` table with the following structure:

- `id`: UUID (Primary Key)
- `email`: VARCHAR(255) (Unique)
- `name`: VARCHAR(255)
- `picture`: TEXT (Optional)
- `addedOn`: TIMESTAMP
- `lastUpdated`: TIMESTAMP
- `addedBy`: UUID (References users.id)
- `updatedBy`: UUID (References users.id)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main page with auth logic
├── components/            # Reusable components
│   ├── atoms/            # Basic UI components
│   ├── molecules/        # Composite components
│   └── templates/        # Page-level components
├── lib/                  # Utilities and configurations
│   ├── auth-context.tsx  # Authentication context
│   ├── providers.tsx     # App providers
│   └── supabase.ts       # Supabase client
├── types/                # TypeScript type definitions
│   └── database.ts       # Database types
└── hooks/                # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Follow the coding standards defined in `cursor_rules.md`
2. Use TypeScript for all new code
3. Follow the atomic design pattern for components
4. Write tests for new features
5. Update documentation as needed

## License

This project is private and proprietary.
