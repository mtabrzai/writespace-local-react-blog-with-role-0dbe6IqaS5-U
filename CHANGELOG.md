# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-08-20

### Added
- **Project Initialization**
  - Setup TypeScript + React project with Vite
  - Configure Tailwind CSS for styling
  - Add Zustand for state management
  - Implement React Hook Form with Zod validation
  - Setup React Router DOM for client-side routing
  - Add Axios for HTTP requests
  - Integrate date-fns for date handling
  - Configure Vitest and Testing Library for testing

- **Authentication System**
  - User registration with username, email, and password
  - User login with email and password
  - JWT-based authentication with token storage
  - Protected routes for authenticated users
  - Admin role protection for admin-only routes
  - Persistent authentication state using localStorage

- **Blog Management**
  - Create new blog posts with title and content
  - Edit existing blog posts
  - Delete blog posts
  - Publish/unpublish blog posts
  - View list of all blog posts with pagination
  - View individual blog post details
  - Filter posts by status (published/draft)

- **Admin Features**
  - Admin dashboard with platform statistics
    - Total users count
    - Total posts count
    - Published posts count
    - Draft posts count
    - Recent users list
    - Recent posts list
  - User management
    - View all users with pagination
    - Search users by username or email
    - Delete users
    - View user details

- **UI Components**
  - Reusable Button component with variants and loading states
  - Card components for consistent layout
  - Avatar component with role indicators
  - Form components with validation
  - Navbar with responsive design
  - Toaster for notifications
  - Responsive grid layouts

- **Landing Page**
  - Hero section with call-to-action buttons
  - Features section highlighting platform capabilities
  - Latest posts section with preview cards

- **Testing**
  - Unit tests for UI components
  - Unit tests for authentication store
  - Unit tests for blog store
  - Unit tests for admin store
  - Unit tests for localStorage service
  - Test coverage reporting

- **Development & Deployment**
  - Vite configuration for optimized builds
  - Environment variables setup
  - Vercel deployment configuration
  - Project structure documentation
  - Contribution guidelines
  - MIT License

### Changed
- Initial project structure and configuration

### Fixed
- Initial setup issues and configuration adjustments

### Security
- JWT token storage in localStorage
- Protected routes for sensitive areas
- Admin role verification