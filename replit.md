# HopHopFood - Professional Donation Platform

## Overview

HopHopFood is a mobile-first web application designed as a professional donation platform to fight food waste. The application connects food professionals (restaurants, supermarkets, festivals, theaters, wellness businesses) with beneficiaries by enabling them to manage and donate surplus food products efficiently.

The platform provides a comprehensive business management system featuring product inventory management, donation scheduling, collection time management, and business profile administration. The application emphasizes user experience with a clean, modern interface built around a mobile-first design philosophy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching, combined with local React state (useState, useEffect)
- **UI Framework**: shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Form Management**: React Hook Form with Zod validation for robust form handling and validation

### Mobile-First Design System
- **Layout**: Dedicated mobile container with bottom navigation tabs (Accueil, Produits, Offrir, Horaire, Autres)
- **Responsive Design**: Mobile-optimized components with max-width constraints and touch-friendly interfaces
- **Navigation**: Tab-based navigation system optimized for mobile interaction patterns
- **Color Scheme**: Primary green theme (#16a34a) with comprehensive color system using CSS custom properties

### Backend Architecture
- **Server Framework**: Express.js with TypeScript for API development
- **Database Integration**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Data Storage**: In-memory storage implementation for development/MVP with interface-based design for easy database migration
- **API Design**: RESTful API structure with consistent error handling and response formatting

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema Design**: Comprehensive business data model including:
  - Business profiles with operational details
  - Product inventory with categorization and stock management
  - Donation management with scheduling and availability tracking
  - Schedule management for collection times
  - Closure management for exceptional business hours
- **Database Provider**: Configured for Neon Database (serverless PostgreSQL)

### Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Type Checking**: TypeScript with strict configuration for type safety
- **Code Quality**: ESBuild for server-side bundling and optimization
- **Development Environment**: Hot module replacement and runtime error handling for efficient development

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **State Management**: TanStack React Query v5 for server state management
- **Form Handling**: React Hook Form with Hookform Resolvers for validation integration

### UI and Styling
- **Component Library**: Extensive Radix UI component collection for accessible primitives
- **Styling Framework**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React for consistent iconography
- **Utility Libraries**: clsx and tailwind-merge for conditional styling, class-variance-authority for component variants

### Backend and Database
- **Database**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- **ORM**: Drizzle ORM with Drizzle Kit for migrations and schema management
- **Validation**: Zod for runtime type validation and schema validation
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Development and Build Tools
- **Build Tools**: Vite with React plugin, ESBuild for server bundling
- **TypeScript**: Full TypeScript support with strict configuration
- **Development Enhancements**: Replit-specific plugins for error overlay and cartographer integration
- **Utility Libraries**: date-fns for date manipulation, nanoid for unique ID generation

### Database Configuration
- **Connection**: PostgreSQL database via DATABASE_URL environment variable
- **Schema Management**: Drizzle migrations in dedicated migrations directory
- **Type Safety**: Drizzle-Zod integration for automatic Zod schema generation from database schema