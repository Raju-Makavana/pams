# Pet Adoption Management System - Frontend

A modern React + TypeScript frontend for the Pet Adoption Management System, built with Vite, shadcn/ui, and TailwindCSS.

## Features

### User Features
- Browse available pets with search and filters
- View detailed pet information
- User registration and authentication
- Submit adoption applications
- Track application status
- User dashboard

### Admin Features
- Manage pets (Create, Read, Update, Delete)
- Upload pet photos
- Review adoption applications
- Approve or reject applications
- View statistics and analytics

### UI/UX Features
- Responsive design for all devices
- Modern UI with shadcn/ui components
- Dark mode support
- Pagination for pet listings
- Real-time form validation
- Loading states and error handling

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your API URL:
```env
VITE_API_URL=http://localhost:3001/api/v1
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The app will start on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
pams/
├── src/
│   ├── api/                 # API integration
│   │   ├── client.ts       # Axios client with interceptors
│   │   ├── auth.ts         # Authentication API calls
│   │   ├── pets.ts         # Pet-related API calls
│   │   └── applications.ts # Application API calls
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── layout/        # Layout components
│   ├── pages/             # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── PetList.tsx
│   │   ├── PetDetails.tsx
│   │   ├── Dashboard.tsx
│   │   ├── MyApplications.tsx
│   │   └── AdminDashboard.tsx
│   ├── store/             # State management
│   │   └── authStore.ts   # Authentication store
│   ├── types/             # TypeScript types
│   │   └── index.ts       # Shared types
│   ├── lib/               # Utility functions
│   │   └── utils.ts       # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── App.tsx            # Main App component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── components.json       # shadcn/ui configuration
├── tailwind.config.js    # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── package.json
```

## Available Routes

### Public Routes
- `/` - Home page
- `/pets` - Browse all available pets
- `/pets/:id` - View pet details
- `/login` - User login
- `/register` - User registration

### Authenticated Routes
- `/dashboard` - User dashboard
- `/my-applications` - View user's adoption applications

### Admin Routes
- `/admin/*` - Admin dashboard and management

## API Integration

The frontend communicates with the backend API using Axios with the following features:

### Request Interceptor
- Automatically adds JWT token to requests
- Handles authentication headers

### Response Interceptor
- Handles 401 errors (unauthorized)
- Automatic redirect to login on token expiration

### API Modules
- **auth.ts**: User registration, login, logout, profile management
- **pets.ts**: Pet listing, details, CRUD operations (admin)
- **applications.ts**: Application submission, status tracking, admin review

## State Management

### Auth Store (Zustand)
- User authentication state
- Token management
- User profile data
- Role-based access control

## Styling

### TailwindCSS
- Utility-first CSS framework
- Custom color scheme with CSS variables
- Responsive design utilities

### shadcn/ui
- Pre-built accessible components
- Customizable with Tailwind
- Consistent design system

## TypeScript Types

Comprehensive type definitions for:
- User and authentication
- Pets and pet listings
- Adoption applications
- API responses
- Pagination

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:3001/api/v1 |

## Development

### Adding shadcn/ui Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# etc.
```

### Code Organization

- Place reusable components in `src/components`
- Page components go in `src/pages`
- API calls in `src/api`
- Types in `src/types`
- Utilities in `src/lib`

## Features to Implement

The following pages are placeholders and need full implementation:

1. **Login/Register Pages**
   - Form validation
   - API integration
   - Error handling

2. **Pet List Page**
   - Grid/List view
   - Search functionality
   - Filters (species, breed, age)
   - Pagination

3. **Pet Details Page**
   - Photo gallery
   - Pet information
   - Apply to adopt button

4. **User Dashboard**
   - Profile management
   - Application overview
   - Quick actions

5. **My Applications**
   - Application history
   - Status tracking
   - Details view

6. **Admin Dashboard**
   - Pet management (CRUD)
   - Photo upload
   - Application review
   - Statistics

## Best Practices

- Use TypeScript for type safety
- Follow React hooks best practices
- Implement proper error boundaries
- Add loading states
- Handle edge cases
- Write accessible components
- Use semantic HTML
- Optimize images
- Implement code splitting

## License

ISC
