# CareConnect Healthcare Platform

## Overview

CareConnect is a comprehensive healthcare platform designed to help underserved communities and first-generation immigrants navigate the healthcare system. The platform provides multilingual support (English and Spanish) for finding healthcare providers, booking appointments, managing health records, and receiving AI-powered healthcare guidance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **File Uploads**: Uppy with dashboard interface for object storage uploads

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Authentication**: OpenID Connect with Replit Auth integration using Passport.js
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses

### Database Architecture
- **Primary Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Schema**: Normalized relational design with tables for users, providers, appointments, health records, chat conversations, and sessions
- **Migrations**: Drizzle Kit for schema management and migrations

### Authentication System
- **Provider**: Replit OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Authorization**: Role-based access control with authenticated route protection
- **User Management**: Automatic user creation/update on authentication

### AI Integration
- **Provider**: OpenAI GPT-4o for healthcare guidance
- **Features**: Multilingual healthcare assistance, conversation history, and structured JSON responses
- **Safety**: Built-in disclaimers for medical advice with recommendations to consult healthcare professionals

### Object Storage
- **Provider**: Google Cloud Storage with Replit sidecar authentication
- **Features**: File upload handling, ACL-based access control, and presigned URL generation
- **Security**: Custom access control policies with user group management

### Multi-language Support
- **Languages**: English and Spanish throughout the application
- **Implementation**: Client-side language switching with conditional content rendering
- **Scope**: UI elements, AI responses, and user-facing content

### Component Architecture
- **Design System**: Shadcn/ui components with Radix UI primitives
- **Styling**: Utility-first approach with Tailwind CSS
- **Theming**: CSS custom properties for consistent design tokens
- **Accessibility**: Built-in accessibility features from Radix UI components

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Google Cloud Storage**: Object storage for file uploads and management
- **Replit Infrastructure**: Authentication provider and deployment platform

### AI Services
- **OpenAI API**: GPT-4o model for healthcare assistance and guidance
- **Language Processing**: Natural language understanding for multilingual support

### Authentication
- **Replit OIDC**: Primary authentication provider with automatic user provisioning
- **Session Management**: PostgreSQL-backed sessions with secure cookie handling

### UI and Styling
- **Radix UI**: Headless component primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide Icons**: Consistent icon library throughout the application

### Development Tools
- **Vite**: Fast development server and build tool with HMR support
- **TypeScript**: Type safety and enhanced developer experience
- **ESBuild**: Fast JavaScript bundling for production builds
- **TanStack Query**: Powerful data fetching and caching library