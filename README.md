# Movie Database

A full-stack movie database application built as a home assignment for a job interview. This application allows users to browse popular movies, search for movies, and view detailed information about individual films using data from The Movie Database (TMDB) API.

## 🎯 Project Overview

This project consists of a **NestJS backend API** and a **Nuxt.js frontend** that work together to provide a seamless movie browsing experience. The application features:

- **Popular Movies**: Browse trending and popular movies with pagination
- **Movie Search**: Search for movies by title with debounced input
- **Movie Details**: View comprehensive information about individual movies
- **Responsive Design**: Modern UI built with PrimeVue components
- **Server-Side Rendering**: Fast initial page loads with Nuxt SSR

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Axios** - HTTP client for API requests
- **Swagger** - API documentation
- **Jest** - Unit testing framework
- **Helmet** - Security middleware

### Frontend
- **Nuxt 3** - Vue.js framework with SSR
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **PrimeVue** - UI component library
- **Vitest** - Unit testing framework
- **SCSS** - Styling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - Package manager
- **TMDB Bearer Token** - See configuration section below

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd movie-database
```

### 2. Install Backend Dependencies

```bash
cd backend
pnpm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
pnpm install
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
HOST=0.0.0.0
PORT=3000

# TMDB API Configuration
TMDB_TOKEN=your_bearer_token_here
```

**Important Note about TMDB API Authentication:**

The TMDB API uses a **bearer token** for authentication instead of a traditional API key. This is because the TMDB API documentation does not specify how to create a token based on an API key. 

To obtain a bearer token:
1. Visit [TMDB API Documentation](https://developers.themoviedb.org/3/getting-started/authentication)
2. Follow the authentication flow to obtain an access token
3. Use this token as the `TMDB_TOKEN` in your `.env` file

### Frontend Configuration

The frontend requires the backend API URL. Update `frontend/nuxt.config.ts` or create a `.env` file:

```env
NUXT_API_BASE_URL=http://localhost:3000
```

Or set it in `nuxt.config.ts`:

```typescript
runtimeConfig: {
  apiBaseUrl: process.env.NUXT_API_BASE_URL || 'http://localhost:3000',
  // ...
}
```

## 🏃 Running the Application

### Development Mode

#### Start the Backend

```bash
cd backend
pnpm start:dev
```

The backend API will be available at `http://localhost:3000`
- API Documentation (Swagger): `http://localhost:3000/api`

#### Start the Frontend

```bash
cd frontend
pnpm dev
```

The frontend will be available at `http://localhost:3001` (or the next available port)

### Production Mode

#### Build and Start Backend

```bash
cd backend
pnpm build
pnpm start:prod
```

#### Build and Start Frontend

```bash
cd frontend
pnpm build
pnpm preview
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pnpm test
```

**Test Coverage:**
- ✅ App Service (4 tests)
- ✅ App Controller (4 tests)
- ✅ Movie Service (12 tests)
- ✅ Movie Controller (11 tests)

**Total: 31 tests**

### Frontend Tests

```bash
cd frontend

# Run all tests
pnpm test
```

**Test Coverage:**
- ✅ MoviePreview Component (11 tests)
- ✅ Index Page (19 tests)
- ✅ Movie Details Page (13 tests)
- ✅ Server API Routes (20 tests)

**Total: 63 tests**

## 🔌 API Endpoints

### Backend API (NestJS)

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check / API info |
| `GET` | `/movie/popular` | Get popular movies |
| `GET` | `/movie/search` | Search movies |
| `GET` | `/movie/:id` | Get movie details by ID |
| `GET` | `/api` | Swagger API documentation |

### Query Parameters

**Popular Movies & Search:**
- `page` (number, default: 1) - Page number
- `language` (string, default: 'en-US') - Language code
- `includeAdult` (boolean, default: false) - Include adult content
- `query` (string, required for search) - Search query

**Example:**
```
GET /movie/popular?page=1&language=en-US
GET /movie/search?query=The Matrix&page=1
GET /movie/550
```

## 🎨 Features

### Frontend Features

1. **Homepage (`/`)**
   - Search movies with 500ms debounce
   - Browse popular movies
   - Pagination for both sections
   - Smooth scrolling to sections

2. **Movie Details (`/movie/:id`)**
   - Comprehensive movie information
   - Genre badges
   - Rating display
   - SEO meta tags
   - Responsive poster images

3. **Movie Preview Component**
   - Reusable movie card component
   - Rating badge
   - Lazy-loaded images
   - Navigation to details page

### Backend Features

1. **Error Handling**
   - Custom exception filters
   - Validation error formatting
   - HTTP status code mapping

2. **Security**
   - Helmet.js security headers
   - CORS configuration
   - Input validation

3. **API Documentation**
   - Swagger/OpenAPI documentation
   - Interactive API explorer

## 🔧 Development

### Code Quality

The project uses ESLint and Prettier for code formatting:

```bash
# Backend
cd backend
pnpm lint
pnpm format

# Frontend
cd frontend
pnpm lint
```

### Environment Variables

**Backend (.env):**
- `NODE_ENV` - Environment (development/production)
- `HOST` - Server host (default: 0.0.0.0)
- `PORT` - Server port (default: 3000)
- `TMDB_TOKEN` - TMDB API bearer token (required)

**Frontend (.env):**
- `NUXT_API_BASE_URL` - Backend API URL (default: http://localhost:3000)

## 📝 Notes

### TMDB API Authentication

As mentioned in the configuration section, this project uses a bearer token for TMDB API authentication. The TMDB API documentation does not provide clear instructions on converting an API key to a bearer token, so the bearer token must be obtained directly through the TMDB authentication flow.

### Testing Strategy

- **Backend**: Unit tests for services and controllers with mocked dependencies
- **Frontend**: Component tests, page tests, and server API route tests
- Tests use mocking to isolate units and avoid external API calls during testing

### Performance Considerations

- Frontend uses debounced search (500ms) to reduce API calls
- Images are lazy-loaded for better performance
- Server-side rendering (SSR) for fast initial page loads
