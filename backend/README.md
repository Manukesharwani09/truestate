# SaleScope Backend API

Backend API for Retail Sales Management System with advanced search, filtering, sorting, and pagination capabilities.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Security**: Helmet, CORS

## Search Implementation

Case-insensitive full-text search across:
- Customer Name
- Phone Number

Uses Prisma's `contains` with `insensitive` mode, equivalent to PostgreSQL `ILIKE`.

## Filter Implementation

Multi-select and range-based filtering:
- **Multi-select**: Customer Region, Gender, Product Category, Tags, Payment Method, Order Status
- **Range**: Age (min/max), Date (from/to)

Filters use Prisma's `IN` operator for multi-select and comparison operators for ranges. All filters combine with AND logic.

## Sorting Implementation

Supports sorting by:
- Date (Newest First/Oldest First)
- Quantity (High to Low/Low to High)
- Customer Name (A-Z/Z-A)

Uses Prisma's `orderBy` with dynamic field and direction.

## Pagination Implementation

- Page size: 10 items per page (configurable, max 100)
- Zero-indexed pages (page 0 = first page)
- Returns: `totalElements`, `totalPages`, `currentPage`
- Uses Prisma's `skip` and `take` for efficient pagination

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your PostgreSQL connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/salescope?schema=public"
PORT=5000
NODE_ENV=development
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 4. Import CSV Data

```bash
# Create data directory
mkdir data

# Place your CSV file (truestate_assignment_dataset.csv) in backend/data/sales.csv
# Then run the seed command:
npm run prisma:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:5000`

### 6. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/sales
Get sales data with search, filter, sort, and pagination.

**Request Body:**
```json
{
  "currentPage": 0,
  "pageSize": 10,
  "searchPhrase": "john",
  "searchOn": ["customerName", "phoneNumber"],
  "sortBy": "date",
  "sortDir": "desc",
  "filters": [
    {
      "field": "customerRegion",
      "operation": "IN",
      "value": ["North", "South"]
    }
  ]
}
```

**Response:**
```json
{
  "currentPage": 0,
  "pageSize": 10,
  "totalElements": 150,
  "totalPages": 15,
  "data": [...]
}
```

### GET /api/sales/filters
Get available filter options for dropdowns.

**Response:**
```json
{
  "customerRegions": ["North", "South", "East", "West"],
  "genders": ["Male", "Female"],
  "productCategories": ["Electronics", "Clothing"],
  "tags": ["premium", "discount"],
  "ageRange": { "min": 18, "max": 80 }
}
```

### GET /api/sales/stats
Get sales statistics.

**Response:**
```json
{
  "totalSales": 50000,
  "totalRevenue": 15000000,
  "averageOrderValue": 300
}
```

## Architecture Highlights

- **Query Builder Pattern**: Reusable, type-safe query building
- **Service Layer**: Business logic separated from controllers
- **Type Safety**: Full TypeScript coverage
- **Input Validation**: Field whitelisting for security
- **Error Handling**: Comprehensive error responses
- **Performance**: Indexed database fields, batch operations
