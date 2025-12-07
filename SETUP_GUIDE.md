# SaleScope - Quick Setup Guide

Get your application running in minutes!

## Prerequisites

- **Node.js 18+** (Check: `node --version`)
- **PostgreSQL 14+** (or use Docker)
- **npm** or **yarn**

---

## Option 1: Quick Start with Docker (Easiest)

### 1. Download CSV Dataset
- Download `truestate_assignment_dataset.csv` from Google Drive
- Place it in `backend/data/sales.csv`

### 2. Run with Docker
```bash
# Start all services
docker-compose up -d

# Wait for services to start (30 seconds)
# Then run migrations and seed
docker exec -it salescope-backend npx prisma migrate deploy
docker exec -it salescope-backend npm run prisma:seed
```

### 3. Access Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## Option 2: Manual Setup (For Development)

### Step 1: Install PostgreSQL

**macOS (Homebrew)**
```bash
brew install postgresql@14
brew services start postgresql@14
createdb salescope
```

**Ubuntu/Debian**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb salescope
```

**Windows**
- Download from postgresql.org
- Install and create database "salescope"

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

**Edit `backend/.env`:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/salescope?schema=public"
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

Replace `username` and `password` with your PostgreSQL credentials.

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### Step 3: Import CSV Data

1. Download the dataset CSV file
2. Create directory and place file:
```bash
mkdir data
# Place truestate_assignment_dataset.csv in backend/data/sales.csv
```

3. Run seed command:
```bash
npm run prisma:seed
```

This will import all sales data into PostgreSQL. For a 235MB file, this may take a few minutes.

### Step 4: Start Backend Server

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

Test: http://localhost:5000/health

### Step 5: Setup Frontend

Open a **new terminal window**:

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

**Edit `frontend/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173`

### Step 6: Access Application

Open browser: **http://localhost:5173**

---

## Verification Checklist

- [ ] PostgreSQL is running
- [ ] Database "salescope" exists
- [ ] Backend .env is configured
- [ ] Backend dependencies installed
- [ ] Prisma migrations completed
- [ ] CSV data imported
- [ ] Backend server running (port 5000)
- [ ] Frontend .env is configured
- [ ] Frontend dependencies installed
- [ ] Frontend server running (port 5173)
- [ ] Can access application in browser

---

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running: `ps aux | grep postgres`
- Verify DATABASE_URL in .env is correct
- Check database exists: `psql -l`

### "Port already in use"
- Backend: Change PORT in backend/.env
- Frontend: Change port in vite.config.ts

### "CSV file not found"
- Ensure file is at `backend/data/sales.csv`
- Check file name matches exactly
- Verify file path is correct

### "CORS error"
- Ensure backend ALLOWED_ORIGINS includes frontend URL
- Check both servers are running
- Verify VITE_API_URL in frontend/.env

### "Prisma Client error"
- Run `npm run prisma:generate` in backend
- Delete node_modules and reinstall
- Check Prisma schema syntax

### "Build errors"
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)
- Clear TypeScript cache: `rm -rf dist`

---

## Database Management

### View Data
```bash
cd backend
npm run prisma:studio
```

Opens Prisma Studio at http://localhost:5555

### Reset Database
```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```

⚠️ This will delete all data and re-import from CSV

### Backup Database
```bash
pg_dump salescope > backup.sql
```

### Restore Database
```bash
psql salescope < backup.sql
```

---

## Development Commands

### Backend
```bash
cd backend

npm run dev              # Development server with watch
npm run build            # Build TypeScript
npm start                # Production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open database GUI
npm run prisma:seed      # Import CSV data
```

### Frontend
```bash
cd frontend

npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

### Root (Monorepo)
```bash
npm run install:all     # Install all dependencies
npm run dev             # Run both frontend and backend
npm run build:all       # Build both projects
```

---

## Next Steps

After successful setup:

1. **Explore the UI**: Try search, filters, sorting, pagination
2. **Check the Code**: Review the clean architecture
3. **Read Documentation**: See `docs/architecture.md`
4. **Deploy**: Follow `DEPLOYMENT.md` for deployment options
5. **Customize**: Add your own features and improvements

---

## Getting Help

### Check Logs
- Backend: Console output in terminal
- Frontend: Browser console (F12)
- Database: PostgreSQL logs

### Common Issues
1. Port conflicts → Change ports
2. Database connection → Check credentials
3. CORS errors → Verify ALLOWED_ORIGINS
4. CSV import fails → Check file format and path

---

## Production Build

When ready to deploy:

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

See `DEPLOYMENT.md` for deployment guides.

---

## Database Schema Info

**Primary Table**: `sales`

**Key Indexes** (Already created):
- customer_name, phone_number (for search)
- customer_region, gender, age (for filters)
- product_category, payment_method (for filters)
- date, order_status (for filters and sorting)

**Total Fields**: 25 fields covering customer, product, sales, and operational data

---

## Performance Tips

1. **Use Filters**: Start with filters before searching
2. **Database Indexes**: Already optimized
3. **Page Size**: Default 10 items is optimal
4. **Caching**: Frontend caches for 30 seconds
5. **Search Debounce**: 300ms delay prevents excessive requests

---

## Project Statistics

- **Backend**: ~15 TypeScript files
- **Frontend**: ~15 React components
- **Total Lines**: ~3000+ lines of code
- **Tech Stack**: 10+ modern technologies
- **API Endpoints**: 3 main endpoints
- **Features**: Search, 8 filters, 3 sort options, pagination

---

## Success Indicators

Your setup is successful when:
- ✅ Both servers start without errors
- ✅ Database shows imported sales records
- ✅ Frontend loads without console errors
- ✅ Search returns results
- ✅ Filters work correctly
- ✅ Pagination navigates properly
- ✅ Statistics display on dashboard

---

## Support & Resources

- **README.md**: Project overview
- **docs/architecture.md**: System architecture
- **DEPLOYMENT.md**: Deployment guides
- **Backend README**: Backend-specific docs
- **Frontend README**: Frontend-specific docs

---

Good luck with your setup! 🚀

If you encounter issues, check the troubleshooting section above or review the application logs.
