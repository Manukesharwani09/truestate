# SaleScope Deployment Guide

This guide covers multiple deployment options for SaleScope.

## Table of Contents

1. [Docker Deployment (Recommended for Local/VPS)](#docker-deployment)
2. [Vercel + Supabase (Recommended for Quick Deploy)](#vercel--supabase)
3. [Render Deployment](#render-deployment)
4. [Railway Deployment](#railway-deployment)
5. [Manual VPS Deployment](#manual-vps-deployment)

---

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd SaleScope
```

2. **Configure Environment**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/salescope?schema=public"
PORT=5000
NODE_ENV=production
```

3. **Build and Run**
```bash
docker-compose up -d
```

4. **Setup Database**
```bash
# Access backend container
docker exec -it salescope-backend sh

# Run migrations
npx prisma migrate deploy

# Seed data (place CSV in backend/data/sales.csv first)
npm run prisma:seed
```

5. **Access Application**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## Vercel + Supabase

Perfect for quick, free deployment.

### Backend (Vercel)

1. **Setup Supabase Database**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get connection string from Settings → Database

2. **Deploy Backend to Vercel**
```bash
cd backend
npm install -g vercel
vercel
```

3. **Configure Environment Variables in Vercel**
   - `DATABASE_URL`: Your Supabase connection string
   - `NODE_ENV`: production
   - `ALLOWED_ORIGINS`: Your frontend URL

4. **Run Migrations**
```bash
npx prisma migrate deploy
```

### Frontend (Vercel)

1. **Deploy Frontend**
```bash
cd frontend
vercel
```

2. **Configure Environment Variable**
   - `VITE_API_URL`: Your backend Vercel URL

---

## Render Deployment

### Backend

1. **Create New Web Service**
   - Connect GitHub repository
   - Select `backend` directory
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

2. **Add Environment Variables**
   - `DATABASE_URL`: Render PostgreSQL URL
   - `NODE_ENV`: production
   - `ALLOWED_ORIGINS`: Frontend URL

3. **Create PostgreSQL Database**
   - Create new PostgreSQL instance in Render
   - Copy internal database URL to `DATABASE_URL`

### Frontend

1. **Create New Static Site**
   - Connect GitHub repository
   - Select `frontend` directory
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Add Environment Variable**
   - `VITE_API_URL`: Backend URL

---

## Railway Deployment

### Full Stack Deploy

1. **Create New Project**
   - Connect GitHub repository

2. **Add PostgreSQL Database**
   - Add PostgreSQL service
   - Copy connection string

3. **Deploy Backend**
   - Add service from repo
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
   - Add environment variables

4. **Deploy Frontend**
   - Add service from repo
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`
   - Add `VITE_API_URL` variable

---

## Manual VPS Deployment

### Prerequisites
- Ubuntu 20.04+ VPS
- Node.js 18+
- PostgreSQL 14+
- Nginx

### Backend Setup

1. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2
```

2. **Setup PostgreSQL**
```bash
sudo -u postgres psql
CREATE DATABASE salescope;
CREATE USER salescopeuser WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE salescope TO salescopeuser;
\q
```

3. **Deploy Backend**
```bash
# Clone repository
git clone <repository-url>
cd SaleScope/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env
# Set DATABASE_URL with your PostgreSQL credentials

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build
npm run build

# Start with PM2
pm2 start dist/index.js --name salescope-api
pm2 save
pm2 startup
```

### Frontend Setup

1. **Build Frontend**
```bash
cd ../frontend
npm install
npm run build
```

2. **Setup Nginx**
```bash
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/salescope
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    root /path/to/SaleScope/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/salescope /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

3. **Setup SSL (Optional)**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables Reference

### Backend
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.com
```

### Frontend
```env
VITE_API_URL=https://your-backend.com/api
```

---

## Post-Deployment

### Import CSV Data

After deployment, import the sales data:

1. Upload CSV file to server/service
2. Place in `backend/data/sales.csv`
3. Run seed command:
```bash
npm run prisma:seed
```

### Monitoring

- **Backend Logs**: Check application logs for errors
- **Database**: Monitor query performance
- **Frontend**: Use browser dev tools and error tracking

### Backup

Regular database backups:
```bash
pg_dump salescope > backup_$(date +%Y%m%d).sql
```

---

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database is running
- Verify network connectivity

### CORS Errors
- Ensure ALLOWED_ORIGINS includes frontend URL
- Check protocol (http vs https)

### Build Failures
- Clear node_modules and reinstall
- Verify Node.js version (18+)
- Check for TypeScript errors

---

## Performance Tips

1. **Enable Compression**: Gzip/Brotli for static files
2. **CDN**: Use CDN for frontend assets
3. **Database Indexes**: Already configured in schema
4. **Caching**: Implement Redis for frequently accessed data
5. **Connection Pooling**: Configure Prisma connection limits

---

## Security Checklist

- [ ] Use strong database passwords
- [ ] Enable SSL/HTTPS
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Monitor application logs
- [ ] Implement rate limiting (optional)
- [ ] Regular backups

---

## Support

For deployment issues, check:
1. Application logs
2. Database logs
3. Web server logs
4. Environment variables

Good luck with your deployment! 🚀
