# Petti Project - Cursor AI Rules

## Project Overview
**Petti** is a NextJS application built with TypeScript, Tailwind CSS, and modern React patterns. This document outlines the coding standards and architectural decisions that all AI assistants must follow when working on this project.

## Tech Stack
- **Framework**: NextJS 15+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: Jotai
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table
- **Utilities**: Ramda, Axios
- **Drawer**: Vaul (for form display)
- **Modals**: Radix UI Dialog (for confirmations)

## 1. Atomic Design Structure

### Folder Organization
```
src/
├── components/
│   ├── atoms/           # Basic building blocks (Button, Input, etc.)
│   ├── molecules/       # Simple combinations (SearchBox, Card, etc.)
│   ├── organisms/       # Complex components (Header, DataTable, etc.)
│   └── templates/       # Page layouts
├── modules/             # Feature-based modules
│   └── [feature]/
│       ├── components/  # Feature-specific components
│       ├── hooks/       # Feature-specific hooks
│       ├── types/       # Feature-specific types
│       └── api/         # Feature-specific API calls
├── hooks/               # Global reusable hooks
├── types/               # Global types and interfaces
├── constants/           # Global constants (themes, configs)
├── utils/               # Utility functions
└── lib/                 # Third-party library configurations
```

## 2. TypeScript Standards

### Type Organization
- **Global types**: Place in `src/types/` directory
- **Feature types**: Place in `modules/[feature]/types/`
- **Component types**: Define interfaces for all component props
- **API types**: Define request/response interfaces

### Type Naming Conventions
```typescript
// Interfaces for object shapes
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// Types for unions, primitives, or computed types
type UserRole = 'admin' | 'user' | 'guest';
type UserWithRole = UserProfile & { role: UserRole };

// Enums as const objects
const UserRoles = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;
type UserRole = typeof UserRoles[keyof typeof UserRoles];
```

## 3. Theme and Styling

### Color System
Use the defined theme constants in `src/constants/theme.ts`:

```typescript
export const colors = {
  primary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    // ... full scale
    950: '#020617',
  },
  secondary: {
    // Similar structure
  },
  tertiary: {
    // Similar structure
  },
} as const;
```

### Styling Rules
- Use Tailwind CSS classes
- Create reusable component variants using `class-variance-authority`
- Use `clsx` and `tailwind-merge` for conditional classes
- Follow mobile-first responsive design
- Maintain consistent spacing using Tailwind's spacing scale

## 4. Component Standards

### Component Structure
```typescript
// 1. Imports (React, hooks, libraries, types)
import React from 'react';
import { cn } from '@/lib/utils';

// 2. Types/Interfaces
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// 3. Component Definition
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'base-button-styles',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Component Rules
- **Maximum 150 lines per component file**
- Use functional components with TypeScript interfaces
- Extract complex logic into custom hooks
- Use descriptive, boolean-prefixed variable names (`isLoading`, `hasError`)
- Implement proper error boundaries and null checks

## 5. Hooks and State Management

### Custom Hooks
- Place global hooks in `src/hooks/`
- Place feature-specific hooks in `modules/[feature]/hooks/`
- Use Jotai for global state management
- Use TanStack Query for server state

### Hook Naming
```typescript
// Boolean state hooks
export const useToggle = (initialValue = false) => { /* ... */ };

// Data fetching hooks
export const useUserProfile = (userId: string) => { /* ... */ };

// Form hooks
export const useUserForm = () => { /* ... */ };
```

## 6. Form Handling

### Form Standards
- Use React Hook Form for all forms
- Integrate Zod for validation schemas
- Use `@hookform/resolvers/zod` for validation
- Implement proper error handling and user feedback

### Form Structure
```typescript
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

export const useUserForm = () => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(schema),
  });

  return { form, onSubmit: form.handleSubmit(handleSubmit) };
};
```

## 7. API and Data Fetching

### API Standards
- Use Axios for HTTP requests
- Define API types in `modules/[feature]/types/api.ts`
- Use TanStack Query for caching and state management
- Implement proper error handling

### Query Structure
```typescript
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## 8. UI Component Guidelines

### Radix UI Usage
- Use Radix UI primitives as base components
- Create styled wrappers around Radix components
- Maintain accessibility features
- Use proper ARIA attributes

### Drawer vs Modal Usage
- **Drawer (Vaul)**: Use for forms and content that requires scrolling
- **Modal (Radix Dialog)**: Use for confirmations, alerts, and simple interactions

## 9. Code Quality Standards

### Performance
- Use `React.memo` for expensive components
- Implement proper memoization with `useMemo` and `useCallback`
- Use code splitting with `React.lazy` and `Suspense`
- Optimize images and assets

### Error Handling
- Implement error boundaries
- Use proper null checks and guard clauses
- Provide user-friendly error messages
- Log errors appropriately

### Testing
- Write unit tests for utilities and hooks
- Write integration tests for components
- Use React Testing Library for component tests
- Maintain high test coverage

## 10. File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Hooks**: `useHookName.ts` (e.g., `useUserData.ts`)
- **Types**: `types.ts` or `featureTypes.ts`
- **Utils**: `camelCase.ts` (e.g., `formatDate.ts`)
- **Constants**: `UPPER_CASE.ts` (e.g., `API_ENDPOINTS.ts`)

## 11. Import Organization

```typescript
// 1. React and Next.js imports
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party library imports
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

// 3. Internal imports (absolute paths)
import { Button } from '@/components/atoms/Button';
import { useUser } from '@/hooks/useUser';

// 4. Relative imports
import { UserForm } from './UserForm';
import { userSchema } from './schemas';
```

## 12. Black & White Minimalist Theme

### Design Principles
- Use high contrast black and white colors
- Implement subtle grays for secondary elements
- Use minimal shadows and borders
- Focus on typography and spacing
- Maintain clean, uncluttered interfaces

### Color Usage
- **Primary**: Black (#000000) for text and primary actions
- **Secondary**: Dark gray (#374151) for secondary text
- **Tertiary**: Light gray (#9CA3AF) for disabled states
- **Background**: White (#FFFFFF) for main backgrounds
- **Surface**: Light gray (#F9FAFB) for cards and surfaces

## 13. Code Review Checklist

Before submitting any code, ensure:
- [ ] Component is under 150 lines
- [ ] All props are properly typed
- [ ] Error handling is implemented
- [ ] Accessibility features are included
- [ ] Performance optimizations are applied
- [ ] Tests are written and passing
- [ ] Code follows naming conventions
- [ ] Imports are properly organized
- [ ] Theme constants are used consistently

## 14. Common Patterns

### Error Boundary
```typescript
export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Implementation
};
```

### Loading States
```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### Conditional Rendering
```typescript
{isVisible && <Component />}
{isLoggedIn ? <UserMenu /> : <LoginButton />}
```

---

**Remember**: These rules ensure consistency, maintainability, and scalability across the Petti project. All AI assistants must follow these guidelines when making any changes or additions to the codebase.
