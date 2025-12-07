# SaleScope Frontend

Modern, responsive frontend for the Retail Sales Management System.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Icons**: Lucide React

## Search Implementation

Real-time search with 300ms debounce for optimal performance. Searches across customer name and phone number with case-insensitive matching.

## Filter Implementation

Multi-select filters with checkboxes for:
- Customer Region
- Gender
- Product Category
- Tags
- Payment Method
- Order Status

Range filters for:
- Age (min/max)
- Date (from/to)

All filters maintain state and work in combination. Filter state resets pagination to page 0.

## Sorting Implementation

Dropdown with options:
- Date (Newest First / Oldest First)
- Quantity (High to Low / Low to High)
- Customer Name (A-Z / Z-A)

Sorting maintains active filters and search state.

## Pagination Implementation

- 10 items per page
- Previous/Next navigation
- Shows current page and total pages
- Displays item range (e.g., "Showing 1 to 10 of 150 results")
- Maintains all filter and search states

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Output: `dist/` directory

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── services/        # API service layer
├── store/           # Zustand state management
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── styles/          # Global styles
```

## Key Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional UI**: Clean, elegant design with navy/slate/emerald color scheme
- **Performance**: React Query caching, debounced search, optimized re-renders
- **Type Safety**: Full TypeScript coverage
- **Accessibility**: Keyboard navigation, semantic HTML
- **User Experience**: Loading states, error handling, empty states
