# Complete Setup & Installation Guide

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local or cloud)
  - Local: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended)
- **Git** for version control
- **Code Editor** (VS Code recommended)

### Verify Installation
```bash
node --version      # Should be v16+
npm --version       # Should be v7+
git --version       # Should be installed
```

## 🚀 Quick Start (5 Minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/ramalingam123maha-commits/StudentManagement_V2.git
cd StudentManagement_V2
```

### 2. Install Dependencies
```bash
npm run setup
```

This runs:
- `npm install` (root)
- `npm install` (server)
- `npm install` (client)

### 3. Setup Database

#### Option A: Local MongoDB
```bash
# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Or on Windows
net start MongoDB

# Or run MongoDB directly
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `server/.env` with your connection string

### 4. Configure Environment

Create `server/.env`:
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-management
JWT_SECRET=dev_secret_key_change_in_production
FRONTEND_URL=http://localhost:3000
```

### 5. Start Application
```bash
npm run dev
```

The system will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

## 📝 Detailed Setup Instructions

### Step 1: Node.js Installation

#### macOS
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

#### Windows
1. Download installer from https://nodejs.org/
2. Run the installer
3. Follow the installation wizard
4. Verify in PowerShell or CMD:
```bash
node --version
npm --version
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install nodejs npm

# Verify
node --version
npm --version
```

### Step 2: MongoDB Installation

#### Using MongoDB Atlas (Recommended for Cloud)

1. **Create Account**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Project**
   - Click "New Project"
   - Name your project
   - Click "Create Project"

3. **Create Cluster**
   - Click "Build a Cluster"
   - Select "M0 Free Tier"
   - Choose your region
   - Click "Create Cluster"

4. **Setup Security**
   - Add IP Address: Click "Add My Current IP Address" or "0.0.0.0/0"
   - Create Database User: Set username and password
   - Click "Create User"

5. **Get Connection String**
   - Click "Connect"
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

#### Local MongoDB Installation

**macOS:**
```bash
# Install with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongo --version
```

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer
3. Choose "Install MongoDB as a Service"
4. Complete installation
5. MongoDB will start automatically

**Linux:**
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Step 3: Repository Setup

```bash
# Clone the repository
git clone https://github.com/ramalingam123maha-commits/StudentManagement_V2.git
cd StudentManagement_V2

# List directories to verify
ls -la
# Should show: server/, client/, package.json, README.md, etc.
```

### Step 4: Dependencies Installation

```bash
# Install root dependencies (concurrently)
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

Or simply run:
```bash
npm run setup
```

### Step 5: Environment Configuration

#### Backend Configuration

```bash
cd server
```

Create `.env` file:
```env
# Application
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/student-management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-management

# Authentication
JWT_SECRET=your_very_secure_secret_key_here_min_32_chars

# Frontend
FRONTEND_URL=http://localhost:3000
```

Save and exit.

#### Frontend Configuration (Optional)

The frontend automatically uses the proxy configuration in `package.json` to connect to the backend.

If you need custom configuration, create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### Step 6: Database Initialization

The database will auto-create collections on first run. However, you can manually create indexes:

```bash
# Connect to MongoDB
mongo

# In MongoDB shell
use student-management
db.students.createIndex({ email: 1 })
db.students.createIndex({ registrationNumber: 1 })
db.rooms.createIndex({ roomNumber: 1 })
db.bookings.createIndex({ bookingNumber: 1 })
exit
```

### Step 7: Start Development Servers

#### Option A: Both Servers Concurrently
```bash
npm run dev
```

Both servers will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

#### Option B: Start Separately

Terminal 1 - Backend:
```bash
npm run dev:server
```

Terminal 2 - Frontend:
```bash
npm run dev:client
```

### Step 8: Verify Installation

1. **Backend Health Check**
   - Open http://localhost:5000/api/health
   - Should return: `{ "status": "Server is running", "timestamp": "..." }`

2. **Frontend**
   - Open http://localhost:3000
   - Should see the login page

3. **Database Connection**
   - Check backend console for: ✓ MongoDB connected successfully

## 🔐 First-Time Setup: Create Admin Account

### Option 1: Using API (Postman or curl)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "Admin@123",
    "fullName": "System Administrator",
    "role": "admin"
  }'
```

### Option 2: Using UI

1. Go to http://localhost:3000
2. Click "Register"
3. Fill in the form:
   - Full Name: System Administrator
   - Username: admin
   - Email: admin@example.com
   - Password: Admin@123
   - Role: Admin
4. Click "Register"

### Login with Credentials
```
Email: admin@example.com
Password: Admin@123
```

## 📊 Creating Demo Data

### Register Sample Students

```bash
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "registrationNumber": "STU001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "555-1234",
    "dateOfBirth": "2003-01-15",
    "address": "123 Main St",
    "department": "Engineering"
  }'
```

### Create Sample Booking

```bash
curl -X POST http://localhost:5000/api/hotel/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "ROOM_ID",
    "guestName": "Jane Smith",
    "guestEmail": "jane@example.com",
    "guestPhone": "555-5678",
    "checkInDate": "2024-01-20",
    "checkOutDate": "2024-01-25",
    "numberOfGuests": 2
  }'
```

### Create Sample Task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Project Report",
    "description": "Finalize the quarterly project report",
    "priority": "high",
    "dueDate": "2024-02-15",
    "tags": ["urgent", "project"]
  }'
```

## 🔧 Common Issues & Solutions

### Issue: Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### Issue: MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Ensure MongoDB is running: brew services start mongodb-community
2. Check MongoDB URI in .env
3. For Atlas, verify IP whitelist allows your connection
```

### Issue: npm install Fails
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: CORS Error in Browser Console
```
Solution:
1. Verify FRONTEND_URL in server/.env matches actual frontend URL
2. Check CORS configuration in Express server
3. Clear browser cache and cookies
```

### Issue: JWT Token Expired
```
Solution:
1. Log out and log back in
2. New token will be generated
3. Token expires in 7 days
```

## 📦 Build for Production

### Backend Build
```bash
cd server
npm run build
```

Creates `dist/` folder with compiled JavaScript.

### Frontend Build
```bash
cd client
npm run build
```

Creates `build/` folder optimized for production.

### Run Production Build
```bash
npm start
```

## 🌐 Deployment

### Deploy Backend

#### Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your_atlas_uri>
heroku config:set JWT_SECRET=<secure_key>
```

#### Railway/Render
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Deploy Frontend

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build:client`
3. Set publish directory: `client/build`

## ✅ Post-Deployment Checklist

- [ ] Change JWT_SECRET to a secure random value
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV=production
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS
- [ ] Setup backup strategy
- [ ] Monitor application logs
- [ ] Configure error tracking (e.g., Sentry)
- [ ] Setup database backups
- [ ] Test all critical workflows

## 📞 Support & Resources

- **Documentation**: See [README.md](./README.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Issues**: Open an issue on GitHub
- **API Reference**: See API documentation in code comments

---

**Happy Setting Up! 🚀**
