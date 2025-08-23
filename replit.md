# iShop - Persian E-commerce Platform

## Overview

iShop is a full-stack Persian/Farsi e-commerce platform with a modern, Apple-inspired design. The application features a React frontend with RTL (right-to-left) support, FastAPI backend, and includes a Telegram bot for automated product importing from channel forwards. The platform allows administrators to manage promotional banners and products through a dedicated admin dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19+ with TypeScript and Vite for build tooling
- **Styling**: Tailwind CSS 4+ with custom RTL configurations and Persian font (Vazirmatn)
- **Routing**: React Router v7 for client-side navigation
- **State Management**: React hooks for local state management
- **UI Design**: Apple-inspired clean interface with rose/amber gradient color scheme
- **Runtime Configuration**: Dynamic API endpoint loading from `public/app-config.json` to avoid hardcoded values

### Backend Architecture
- **Framework**: FastAPI for REST API development
- **Database**: SQLAlchemy ORM with SQLite for development (configurable for production)
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Handling**: Local file upload system for product images
- **API Structure**: Modular router-based organization with separate endpoints for auth, banners, and products

### Data Models
- **Users**: Simple username/password authentication for admin access
- **Banners**: Configurable promotional banners with position-based ordering (hero + 4 small banners)
- **Products**: E-commerce products with categories, pricing, and inventory management
- **Pricing**: Integer-based pricing system using smallest currency units (Rials/Tomans)

### External Dependencies

**Third-party Services:**
- Google Fonts API for Vazirmatn Persian font
- Unsplash for placeholder images
- Lucide React for consistent iconography

**Development Tools:**
- Autoprefixer and PostCSS for CSS processing
- Concurrently for running multiple development processes
- TypeScript for type safety

**Python Backend Dependencies:**
- FastAPI with Uvicorn for async web server
- SQLAlchemy for database operations
- Pydantic for data validation
- python-jose for JWT token handling
- passlib with bcrypt for password security
- python-multipart for file upload handling

**Telegram Integration:**
- python-telegram-bot v20+ for automated product importing
- Supports Persian message parsing and image downloading
- Environment-based configuration for bot tokens and channel IDs

**Runtime Configuration:**
- Environment variable support for database URLs, JWT secrets, and bot credentials
- JSON-based frontend configuration for API endpoints
- Automatic database initialization with default admin user and sample banners