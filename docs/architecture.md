# SaleScope - System Architecture Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Data Flow](#data-flow)
5. [Database Design](#database-design)
6. [Module Responsibilities](#module-responsibilities)

---

## Architecture Overview

SaleScope follows a **three-tier architecture** pattern:

```
┌─────────────────────────────────────────────┐
│           Presentation Layer                │
│    (React + TypeScript + Tailwind)          │
└─────────────────┬───────────────────────────┘
                  │ HTTP/REST
┌─────────────────┴───────────────────────────┐
│          Application Layer                  │
│      (Express + TypeScript + Prisma)        │
└─────────────────┬───────────────────────────┘
                  │ SQL
┌─────────────────┴───────────────────────────┐
│            Data Layer                       │
│           (PostgreSQL)                      │
└─────────────────────────────────────────────┘
```

### Design Principles

- **Separation of Concerns**: Clear boundaries between presentation, business logic, and data access
- **Type Safety**: Full TypeScript coverage on both frontend and backend
- **Single Responsibility**: Each module has one clearly defined purpose
- **Reusability**: Generic query builder pattern for flexible data fetching
- **Performance**: Server-side filtering, indexed queries, client-side caching

---

## Backend Architecture

### Layer Structure

```
Backend (Express + TypeScript + Prisma)
│
├── Presentation Layer (Routes + Controllers)
│   ├── Routes: Define API endpoints
│   └── Controllers: Handle HTTP requests/responses
│
├── Business Logic Layer (Services)
│   ├── SalesService: Sales-specific business logic
│   └── QueryBuilderService: Generic query building
│
├── Data Access Layer (Prisma)
│   └── Prisma Client: Type-safe database queries
│
└── Database Layer (PostgreSQL)
    └── Sales Table: Indexed for optimal query performance
```

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Routes Layer                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  sales.routes.ts                                         │   │
│  │  - POST /api/sales                                       │   │
│  │  - GET  /api/sales/filters                              │   │
│  │  - GET  /api/sales/stats                                │   │
│  └────────────────────┬─────────────────────────────────────┘   │
└───────────────────────┼─────────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────────┐
│                 Controllers Layer                                │
│  ┌────────────────────┴─────────────────────────────────────┐   │
│  │  sales.controller.ts                                     │   │
│  │  - getSales()                                            │   │
│  │  - getFilterOptions()                                    │   │
│  │  - getStats()                                            │   │
│  └────────────────────┬─────────────────────────────────────┘   │
└───────────────────────┼─────────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────────┐
│                  Services Layer                                  │
│  ┌────────────────────┴──────────────────┐                      │
│  │  sales.service.ts                     │                      │
│  │  - getSales()                         │                      │
│  │  - getFilterOptions()                 │                      │
│  │  - getSalesStats()                    │                      │
│  │  - convertFiltersToQueryBuilder()     │                      │
│  └────────────────────┬──────────────────┘                      │
│                       │                                          │
│  ┌────────────────────┴──────────────────┐                      │
│  │  queryBuilder.service.ts              │                      │
│  │  - buildWhereConditions()             │                      │
│  │  - buildOrderBy()                     │                      │
│  │  - buildPagination()                  │                      │
│  │  - executeQuery()                     │                      │
│  └────────────────────┬──────────────────┘                      │
└───────────────────────┼─────────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────────┐
│               Data Access Layer                                  │
│  ┌────────────────────┴──────────────────┐                      │
│  │  Prisma Client                        │                      │
│  │  - Type-safe queries                  │                      │
│  │  - Migration management               │                      │
│  │  - Schema generation                  │                      │
│  └────────────────────┬──────────────────┘                      │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                   PostgreSQL
```

### Key Design Patterns

#### 1. Query Builder Pattern

Generic, reusable query building logic that works with any Prisma model:

```typescript
QueryBuilderService
  ├── buildWhereConditions()  // Search + Filters → SQL WHERE
  ├── buildOrderBy()           // Sorting → SQL ORDER BY
  ├── buildPagination()        // Pagination → LIMIT/OFFSET
  └── executeQuery()           // Complete query execution
```

**Benefits:**
- Reusable across different models
- Type-safe query construction
- SQL injection prevention
- Consistent API across endpoints

#### 2. Service Layer Pattern

Business logic separated from HTTP handling:

```typescript
Controller (HTTP) → Service (Business Logic) → Database (Data)
```

**Benefits:**
- Easy to test
- Reusable business logic
- Clear separation of concerns

---

## Frontend Architecture

### Component Hierarchy

```
App (React Query Provider)
│
└── Dashboard
    ├── Header
    ├── Stats Section
    │   └── StatsCard × 3
    │
    └── Main Content (Grid)
        ├── Sidebar
        │   └── FilterPanel
        │       ├── FilterSection × 8
        │       └── CheckboxGroup
        │
        └── Content Area
            ├── Search & Sort Bar
            │   ├── SearchBar
            │   └── SortDropdown
            │
            ├── SalesTable
            │   ├── Table Header
            │   └── Table Rows
            │       └── StatusBadge
            │
            └── Pagination
```

### State Management

```
┌─────────────────────────────────────────────────────────────┐
│                   State Management                          │
│                                                             │
│  ┌─────────────────────────┐  ┌──────────────────────────┐ │
│  │   Zustand Store         │  │   React Query Cache      │ │
│  │   (useFilterStore)      │  │   (TanStack Query)       │ │
│  │                         │  │                          │ │
│  │  - filters              │  │  - sales data            │ │
│  │  - searchQuery          │  │  - filter options        │ │
│  │  - currentPage          │  │  - statistics            │ │
│  │  - sortBy/sortDir       │  │                          │ │
│  │                         │  │  + Caching               │ │
│  │  + Actions              │  │  + Auto-refetch          │ │
│  └─────────────────────────┘  └──────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Zustand**: Manages UI state (filters, search, pagination)
**React Query**: Manages server state (sales data, filter options, stats)

### Data Flow Pattern

```
User Action
    │
    ├─> Update Zustand Store
    │       │
    │       └─> Triggers React Query refetch (via queryKey change)
    │               │
    │               └─> API Call
    │                       │
    │                       └─> Update React Query Cache
    │                               │
    │                               └─> Component Re-render
```

### Module Structure

```
src/
├── components/          # Presentational components
│   ├── SearchBar.tsx   # Search input with debounce
│   ├── FilterPanel.tsx # Multi-select filters
│   ├── SalesTable.tsx  # Data table
│   ├── Pagination.tsx  # Navigation
│   ├── SortDropdown.tsx# Sorting control
│   └── StatsCard.tsx   # Metric display
│
├── pages/
│   └── Dashboard.tsx   # Main page (composition)
│
├── services/
│   └── api.ts          # API client (axios)
│
├── store/
│   └── useFilterStore.ts # Filter state (zustand)
│
├── hooks/
│   └── useSalesData.ts # Data fetching (react-query)
│
├── types/
│   └── index.ts        # TypeScript definitions
│
└── utils/
    └── format.ts       # Formatting utilities
```

---

## Data Flow

### Complete Request Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│                                                                  │
│  User Action (e.g., Apply Filter)                               │
│         │                                                        │
│         ▼                                                        │
│  Update Zustand Store                                           │
│  - filters: { region: ['North', 'South'] }                      │
│  - currentPage: 0 (reset)                                       │
│         │                                                        │
│         ▼                                                        │
│  React Query Hook (useSalesData)                                │
│  - Query key includes all filter state                          │
│  - Detects state change → triggers API call                     │
│         │                                                        │
│         ▼                                                        │
│  API Service (axios)                                            │
│  POST /api/sales                                                │
│  {                                                              │
│    currentPage: 0,                                              │
│    pageSize: 10,                                                │
│    filters: { customerRegion: ['North', 'South'] }             │
│  }                                                              │
└──────────────────┬───────────────────────────────────────────────┘
                   │ HTTP Request
┌──────────────────┴───────────────────────────────────────────────┐
│                        BACKEND                                   │
│                                                                  │
│  Express Router                                                  │
│  - Matches POST /api/sales route                                │
│         │                                                        │
│         ▼                                                        │
│  Sales Controller                                                │
│  - Parse request body                                            │
│  - Validate inputs                                               │
│  - Call SalesService                                             │
│         │                                                        │
│         ▼                                                        │
│  Sales Service                                                   │
│  - Convert UI filters to QueryBuilder format                    │
│  - Call QueryBuilderService                                      │
│         │                                                        │
│         ▼                                                        │
│  Query Builder Service                                           │
│  - Build WHERE conditions                                        │
│    WHERE customerRegion IN ('North', 'South')                   │
│  - Build ORDER BY                                                │
│    ORDER BY date DESC                                            │
│  - Build LIMIT/OFFSET                                            │
│    LIMIT 10 OFFSET 0                                             │
│         │                                                        │
│         ▼                                                        │
│  Prisma Client                                                   │
│  - Execute count query (for totalElements)                      │
│  - Execute main query with conditions                            │
│         │                                                        │
│         ▼                                                        │
│  PostgreSQL                                                      │
│  - Use indexes on customerRegion                                │
│  - Return results                                                │
│         │                                                        │
│         ▼                                                        │
│  Query Builder Service                                           │
│  - Calculate totalPages                                          │
│  - Format response                                               │
│         │                                                        │
│         ▼                                                        │
│  Sales Controller                                                │
│  - Send JSON response                                            │
└──────────────────┬───────────────────────────────────────────────┘
                   │ HTTP Response
┌──────────────────┴───────────────────────────────────────────────┐
│                        FRONTEND                                  │
│                                                                  │
│  API Service                                                     │
│  - Receive response                                              │
│         │                                                        │
│         ▼                                                        │
│  React Query                                                     │
│  - Update cache                                                  │
│  - Trigger re-render                                             │
│         │                                                        │
│         ▼                                                        │
│  Component (SalesTable, Pagination)                              │
│  - Render updated data                                           │
│  - Show 10 results on page 1                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Database Design

### Schema

```sql
CREATE TABLE sales (
  id                    UUID PRIMARY KEY,

  -- Customer Fields
  customer_id           VARCHAR,
  customer_name         VARCHAR,
  phone_number          VARCHAR,
  gender                VARCHAR,
  age                   INTEGER,
  customer_region       VARCHAR,
  customer_type         VARCHAR,

  -- Product Fields
  product_id            VARCHAR,
  product_name          VARCHAR,
  brand                 VARCHAR,
  product_category      VARCHAR,
  tags                  VARCHAR[],

  -- Sales Fields
  quantity              INTEGER,
  price_per_unit        DECIMAL,
  discount_percentage   DECIMAL,
  total_amount          DECIMAL,
  final_amount          DECIMAL,

  -- Operational Fields
  date                  TIMESTAMP,
  payment_method        VARCHAR,
  order_status          VARCHAR,
  delivery_type         VARCHAR,
  store_id              VARCHAR,
  store_location        VARCHAR,
  salesperson_id        VARCHAR,
  employee_name         VARCHAR,

  -- Metadata
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
);
```

### Indexes

```sql
-- Search optimization
CREATE INDEX idx_sales_customer_name ON sales(customer_name);
CREATE INDEX idx_sales_phone_number ON sales(phone_number);

-- Filter optimization
CREATE INDEX idx_sales_customer_region ON sales(customer_region);
CREATE INDEX idx_sales_gender ON sales(gender);
CREATE INDEX idx_sales_age ON sales(age);
CREATE INDEX idx_sales_product_category ON sales(product_category);
CREATE INDEX idx_sales_payment_method ON sales(payment_method);
CREATE INDEX idx_sales_date ON sales(date);
CREATE INDEX idx_sales_order_status ON sales(order_status);

-- Composite index for common query patterns
CREATE INDEX idx_sales_date_region ON sales(date, customer_region);
```

### Performance Considerations

- **Indexes**: All searchable and filterable fields are indexed
- **Data Types**: Appropriate types for query optimization
- **Array Fields**: PostgreSQL native array support for tags
- **Batch Operations**: Seed script uses `createMany` for bulk inserts

---

## Module Responsibilities

### Backend Modules

#### Routes (`src/routes/`)
- **Responsibility**: Define API endpoints and HTTP methods
- **Dependencies**: Controllers
- **Exports**: Express Router instances

#### Controllers (`src/controllers/`)
- **Responsibility**: Handle HTTP requests and responses
- **Tasks**:
  - Parse request parameters
  - Validate inputs
  - Call services
  - Format responses
  - Handle errors
- **Dependencies**: Services
- **No Business Logic**: Thin layer, delegates to services

#### Services (`src/services/`)
- **Responsibility**: Business logic and data orchestration
- **Tasks**:
  - Implement business rules
  - Transform data
  - Coordinate database operations
  - Calculate derived values
- **Dependencies**: Prisma Client, other services

#### Utils (`src/utils/`)
- **Responsibility**: Shared utilities and helpers
- **Examples**:
  - Validators
  - Seed scripts
  - Constants

#### Types (`src/types/`)
- **Responsibility**: TypeScript type definitions
- **Exports**: Interfaces, enums, type aliases

### Frontend Modules

#### Components (`src/components/`)
- **Responsibility**: Reusable UI components
- **Characteristics**:
  - Presentational
  - Props-driven
  - Self-contained styles

#### Pages (`src/pages/`)
- **Responsibility**: Page-level components
- **Characteristics**:
  - Compose multiple components
  - Connect to stores and hooks
  - Handle page-level logic

#### Services (`src/services/`)
- **Responsibility**: API communication
- **Tasks**:
  - HTTP requests
  - Request/response transformation
  - Error handling

#### Store (`src/store/`)
- **Responsibility**: Client-side state management
- **Implementation**: Zustand stores
- **State Types**:
  - Filter state
  - Search state
  - Pagination state

#### Hooks (`src/hooks/`)
- **Responsibility**: Custom React hooks
- **Examples**:
  - Data fetching hooks (React Query)
  - Reusable logic

#### Utils (`src/utils/`)
- **Responsibility**: Utility functions
- **Examples**:
  - Formatting (currency, dates)
  - Validation
  - Constants

---

## Security Considerations

### Backend

1. **Input Validation**: All user inputs validated
2. **SQL Injection Prevention**: Prisma parameterized queries
3. **Field Whitelisting**: Only allowed fields can be sorted/filtered
4. **CORS**: Configured allowed origins
5. **Helmet**: Security headers
6. **Error Handling**: No sensitive data in error responses

### Frontend

1. **Type Safety**: TypeScript prevents runtime errors
2. **XSS Prevention**: React escapes by default
3. **API Error Handling**: Graceful error states
4. **Input Sanitization**: Clean user inputs before API calls

---

## Performance Optimizations

### Backend

1. **Database Indexes**: All searchable fields indexed
2. **Query Optimization**: Prisma generates efficient SQL
3. **Batch Operations**: Bulk inserts during seeding
4. **Count Optimization**: Separate, optimized count query

### Frontend

1. **React Query Caching**: Reduce unnecessary API calls
2. **Debounced Search**: 300ms delay prevents excessive requests
3. **Code Splitting**: Vite lazy loading
4. **Memoization**: React Query automatic memoization
5. **Optimistic Updates**: Immediate UI feedback

---

## Scalability Considerations

### Horizontal Scaling

- **Stateless Backend**: Can run multiple instances
- **Database Connection Pooling**: Prisma connection management
- **CDN for Frontend**: Static files served from CDN

### Vertical Scaling

- **Database**: PostgreSQL supports large datasets
- **Indexes**: Query performance maintained at scale
- **Pagination**: Consistent performance regardless of total records

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│                    User Browser                      │
└──────────────────┬───────────────────────────────────┘
                   │
┌──────────────────┴───────────────────────────────────┐
│               CDN / Static Hosting                   │
│            (Vercel / Netlify / S3)                   │
│                 Frontend Build                       │
└──────────────────┬───────────────────────────────────┘
                   │ API Calls
┌──────────────────┴───────────────────────────────────┐
│            Application Server                        │
│        (Render / Railway / Heroku / AWS)             │
│              Backend (Node.js)                       │
└──────────────────┬───────────────────────────────────┘
                   │ SQL
┌──────────────────┴───────────────────────────────────┐
│           Database Server                            │
│         (Supabase / Railway / AWS RDS)               │
│            PostgreSQL                                │
└──────────────────────────────────────────────────────┘
```

---

## Testing Strategy

### Backend Tests
- **Unit Tests**: Services and utility functions
- **Integration Tests**: API endpoints with test database
- **E2E Tests**: Complete request/response cycle

### Frontend Tests
- **Component Tests**: Individual component rendering
- **Integration Tests**: Component interactions
- **E2E Tests**: User workflows (Playwright/Cypress)

---

## Monitoring and Logging

### Backend
- Request/response logging
- Error tracking
- Performance monitoring
- Database query logging (development)

### Frontend
- Error boundary for React errors
- API error logging
- Performance monitoring (Web Vitals)

---

## Future Enhancements

1. **Authentication**: User login and role-based access
2. **Real-time Updates**: WebSocket for live data
3. **Export**: CSV/Excel export functionality
4. **Analytics**: Charts and visualizations
5. **Advanced Filters**: Nested OR/AND conditions
6. **Saved Filters**: User-defined filter presets
7. **API Rate Limiting**: Prevent abuse
8. **Caching Layer**: Redis for frequently accessed data
