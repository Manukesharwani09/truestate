# SaleScope - Retail Sales Management System

A production-grade web application for managing and analyzing retail sales data with advanced search, filtering, sorting, and pagination capabilities.

## Overview

SaleScope is a full-stack application designed to handle large-scale sales data efficiently. Built with modern technologies and industry best practices, it provides a clean, intuitive interface for sales data analysis with powerful filtering and search capabilities.

## Tech Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Security**: Helmet, CORS

### Frontend

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Icons**: Lucide React

## Search Implementation Summary

Case-insensitive full-text search across customer name and phone number fields. Backend uses Prisma's `contains` with `insensitive` mode (PostgreSQL `ILIKE`). Frontend implements 300ms debounce for optimal performance. Search works alongside all filters and maintains pagination state.

## Filter Implementation Summary

Multi-select filtering for categorical fields (Customer Region, Gender, Product Category, Tags, Payment Method, Order Status) using Prisma's `IN` operator. Range-based filtering for Age (min/max) and Date (from/to) using comparison operators. All filters combine with AND logic and are applied server-side for security and performance.

## Sorting Implementation Summary

Dynamic sorting with support for Date, Quantity, and Customer Name fields. Supports both ascending and descending directions. Uses Prisma's `orderBy` with runtime field selection. Sorting preserves all active filters and search state.

## Pagination Implementation Summary

Server-side pagination with 10 items per page. Zero-indexed page numbers (page 0 = first page). Returns total elements and total pages for accurate navigation. Uses Prisma's `skip` and `take` for efficient querying. Pagination state resets when filters or search changes.

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### 1. Clone Repository

```bash
git clone <truestate>
cd SaleScope
```

### 2. Backend Setup

```bash
cd backend
npm install

# Configure environment
DATABASE_URL=postgres



# Setup database
npm run prisma:generate
npm run prisma:migrate

# Import CSV data
mkdir data
# Place CSV file in backend/data/sales.csv
npm run prisma:seed

# Start backend server
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Configure environment
apiurl

# Start frontend server
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. Access Application

Open browser and navigate to `http://localhost:5173`

## Production Build

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
# Serve the dist/ directory with your preferred web server
```

## API Documentation

### POST /api/sales

Get sales data with search, filter, sort, and pagination.

**Request Body:**

```json
{
  "currentPage": 0,
  "pageSize": 10,
  "searchPhrase": "john",
  "sortBy": "date",
  "sortDir": "desc",
  "filters": {
    "customerRegion": ["North", "South"],
    "gender": ["Male"],
    "ageRange": { "min": 25, "max": 50 },
    "dateRange": { "from": "2024-01-01", "to": "2024-12-31" }
  }
}
```

### GET /api/sales/filters

Get available filter options.

### GET /api/sales/stats

Get sales statistics (total sales, revenue, average order value).

## Features

- **Advanced Search**: Real-time search across multiple fields
- **Multi-Select Filters**: Filter by region, gender, category, tags, payment method, status
- **Range Filters**: Age and date range filtering
- **Dynamic Sorting**: Sort by date, quantity, or customer name
- **Efficient Pagination**: Navigate through large datasets easily
- **Statistics Dashboard**: Key metrics at a glance
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Type Safety**: Full TypeScript coverage on frontend and backend
- **Performance**: Optimized queries, caching, and debounced search

## Project Structure

```
SaleScope/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities
│   │   ├── config/          # Configuration
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # State management
│   │   ├── hooks/           # Custom hooks
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities
│   │   └── styles/          # Global styles
│   └── package.json
│
└── README.md
```

## Author

Manu Kesharwani
Built for TruEstate SDE Intern Assignment
