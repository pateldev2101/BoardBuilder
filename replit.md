# Monday.com Clone - Creative Project Management

## Overview

This is a Monday.com-style project management application built specifically for creative teams to track requests, manage status workflows, and collaborate on projects. The application features a kanban-style board interface with groups of creative requests, status tracking, priority management, and team collaboration features. It's designed to help creative teams manage their workflow from initial brief through completion and going live.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Vite Build System**: Fast development server and optimized production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with custom Monday.com-inspired design system and CSS variables
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript
- **In-Memory Storage**: Currently using MemStorage class for data persistence with sample seed data
- **API Design**: Resource-based REST endpoints for workspaces, boards, groups, and requests
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Development Setup**: Vite integration for full-stack development experience

### Data Model
- **Hierarchical Structure**: Workspaces → Boards → Groups → Requests
- **Creative Request Entity**: Core entity with fields for creative brief, status, priority, type, due dates, assignments
- **User Management**: User profiles with avatars, initials, and color assignments
- **Status Workflow**: "working", "completed", "progress" status tracking
- **Priority System**: "low", "medium", "high" priority levels

### UI/UX Design Patterns
- **Monday.com Visual Style**: Purple/blue color scheme with rounded corners and modern shadows
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Inline Editing**: Click-to-edit functionality for rapid updates
- **Status Badges**: Color-coded status and priority indicators
- **Drag-and-Drop**: Positioned for future implementation with sortable items
- **Modal Forms**: Overlay forms for adding new requests and managing data

## External Dependencies

### Database & ORM
- **Drizzle ORM**: Type-safe SQL query builder configured for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database (configured but not actively used)
- **Database Migrations**: Drizzle Kit for schema management and migrations

### UI & Styling
- **Radix UI**: Comprehensive primitive component library for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Modern icon library for consistent iconography
- **Class Variance Authority**: Utility for managing component variants

### Development & Build
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production server builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Replit Integration**: Development environment optimizations for Replit

### Validation & Forms
- **Zod**: Schema validation for type-safe data handling
- **React Hook Form**: Performant forms with minimal re-renders
- **Drizzle-Zod**: Integration between Drizzle schemas and Zod validation

Note: The application is currently using in-memory storage but is architecturally prepared for PostgreSQL database integration through the configured Drizzle ORM setup.