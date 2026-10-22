# Student Management System (SMS)

A comprehensive full-stack application suite featuring Student Management Dashboard, Hotel Management System, and Task Manager with real-time WebSocket updates and collaborative features.

## 🎯 Features

### 1. Student Management Dashboard
- ✅ Student Registration Management
- ✅ Course Enrollment & Tracking
- ✅ Academic Progress Monitoring
- ✅ Performance Analytics & Reports
- ✅ Real-time Notifications
- ✅ Department-wise Analytics

### 2. Hotel Management System
- ✅ Room Booking Management
- ✅ Guest Check-in/Check-out Operations
- ✅ Reservation Management
- ✅ Billing & Payment Tracking
- ✅ Real-time WebSocket Updates
- ✅ Room Availability Management

### 3. Task Manager Application
- ✅ Task Creation & Assignment
- ✅ Priority Levels (Low, Medium, High, Urgent)
- ✅ Status Tracking (To Do, In Progress, Review, Completed)
- ✅ Deadline Management
- ✅ Collaborative Comments
- ✅ Real-time Updates

## 📋 Tech Stack

### Backend
- **Framework**: Express.js (TypeScript)
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.IO & WebSocket
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: BCrypt for password hashing

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Charts**: Chart.js & React-ChartJS-2
- **Icons**: Lucide React
- **Styling**: CSS3 with Responsive Design

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install Root Dependencies**
   ```bash
   npm install
   ```

2. **Install Server Dependencies**
   ```bash
   cd server && npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd client && npm install
   ```

### Configuration

1. **Server Configuration** - Create `server/.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/student-management
   JWT_SECRET=your_jwt_secret_key_here
   FRONTEND_URL=http://localhost:3000
   ```

2. **Database Setup**
   - Ensure MongoDB is running
   - Database will auto-create collections on first run

### Running the Application

#### Development Mode (Concurrent)
```bash
npm run dev
# Backend runs on http://localhost:5000
# Frontend runs on http://localhost:3000
```

#### Run Server Only
```bash
npm run dev:server
```

#### Run Client Only
```bash
npm run dev:client
```

#### Production Build
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Register new student
- `PATCH /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Enrollments
- `GET /api/enrollments` - Get all enrollments
- `GET /api/enrollments/student/:studentId` - Get student enrollments
- `POST /api/enrollments` - Enroll student in course
- `PATCH /api/enrollments/:id` - Update enrollment
- `POST /api/enrollments/:id/drop` - Drop course

### Reports
- `GET /api/reports/performance` - Academic performance report
- `GET /api/reports/department/:dept` - Department statistics
- `GET /api/reports/enrollment/stats` - Enrollment statistics

### Hotel Management
- `GET /api/hotel/rooms/available` - Get available rooms
- `GET /api/hotel/rooms` - Get all rooms
- `POST /api/hotel/rooms` - Create room
- `GET /api/hotel/bookings` - Get all bookings
- `POST /api/hotel/bookings` - Create booking
- `POST /api/hotel/bookings/:id/checkin` - Check in
- `POST /api/hotel/bookings/:id/checkout` - Check out

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `POST /api/tasks/:id/comments` - Add comment
- `POST /api/tasks/:id/assign` - Assign task
- `DELETE /api/tasks/:id` - Delete task

## 🔐 Authentication

### User Roles
- **Admin** - Full system access, manage users and generate reports
- **Instructor** - Manage students and enrollments, view reports
- **Student** - View personal information and enrollments
- **Staff** - Hotel and task management operations

### Default Demo Credentials
```
Email: admin@example.com
Password: password123
Role: Admin
```

## 🎨 UI/UX Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates** - WebSocket for instant notifications
- **Dark Mode Ready** - CSS variables for easy theme switching
- **Accessible** - WCAG compliant with semantic HTML
- **Modern Dashboard** - Clean, professional interface
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages

## 📊 Database Models

### Student
- Registration Number (Unique)
- Personal Information
- Academic Status
- GPA & Credits
- Department
- Enrollment Dates

### Enrollment
- Student Reference
- Course Reference
- Grade & Score
- Attendance
- Status Tracking

### Task
- Title & Description
- Priority Levels
- Status Tracking
- Assigned Users
- Comments & Collaboration
- Due Dates

### Room (Hotel)
- Room Number (Unique)
- Type & Capacity
- Pricing
- Amenities
- Floor & Status

### Booking
- Booking Number (Unique)
- Guest Information
- Check-in/Check-out Dates
- Payment Status
- Total Price

## 🔄 WebSocket Events

### Real-time Broadcasting
- `student:enrolled` - New student enrollment
- `student:progress-updated` - Student progress update
- `room:booked` - New room booking
- `room:checkin` - Guest check-in
- `room:checkout` - Guest check-out
- `task:created` - New task created
- `task:updated` - Task updated
- `task:assigned` - Task assigned to user

## 📈 Performance Features

- **Database Indexing** - Optimized query performance
- **Pagination Ready** - Scalable data handling
- **Caching** - Efficient API response caching
- **Lazy Loading** - Component optimization
- **Bundle Optimization** - Production-ready build

## 🧪 Testing

```bash
# Run server tests
npm run test:server

# Run all tests
npm run test
```

## 🚀 Deployment

### Server Deployment (Heroku/Railway/Render)
1. Set environment variables
2. MongoDB connection string
3. JWT secret
4. Frontend URL

### Frontend Deployment (Vercel/Netlify)
1. Build the client
2. Set API URL environment variable
3. Deploy build output

## 📝 Project Structure

```
StudentManagement_V2/
├── server/
│   ├── src/
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth, error handling
│   │   ├── config/          # Database config
│   │   └── index.ts         # Server entry
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── client/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Support

For issues and questions:
- Open an issue on GitHub
- Contact development team
- Check documentation

## 🔮 Future Enhancements

- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Two-factor authentication
- [ ] File upload management
- [ ] API rate limiting
- [ ] Advanced search filters
- [ ] Bulk operations

## 📞 Contact

Development Team: Bold Create  
Version: 1.0.0  
Last Updated: 2024

---

**Happy Learning! 🎓**
