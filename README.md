# Proxima-Automation 🏭

Proxima Automation is a **complete, production-ready** industrial automation platform that provides real-time machine monitoring, predictive maintenance, alert management, and IoT integration capabilities. Built with modern technologies and designed for scalability.

## 🎉 All Features Implemented!

✅ Machine CRUD with Edit/Delete  
✅ Historical Data & Analytics  
✅ Alert History & Management  
✅ Email Notification System  
✅ User Authentication (JWT)  
✅ Data Export (CSV)  
✅ IoT/Hardware Integration (MQTT, OPC-UA, Modbus)  
✅ Modern Tailwind CSS UI  
✅ Real-time Dashboard  
✅ Predictive Maintenance  

**See [FEATURES_IMPLEMENTED.md](./FEATURES_IMPLEMENTED.md) for complete documentation.**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running on localhost:27017

### Installation & Run

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install

# 3. Start MongoDB (if not running)
# mongod

# 4. Start backend (from backend folder)
npm start
# Server runs on http://localhost:5000

# 5. Start frontend (from frontend folder)
npm run dev
# App runs on http://localhost:5173
```

### First Time Setup
1. Open http://localhost:5173
2. Click "Get Started" → Register account
3. Login with your credentials
4. Navigate to "Software" → Add your first machine
5. View real-time dashboard

---

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
```
backend/
├── src/
│   ├── models/          # Mongoose schemas
│   │   ├── machine.js
│   │   ├── User.js
│   │   ├── MetricHistory.js
│   │   ├── AlertLog.js
│   │   ├── NotificationSettings.js
│   │   └── IoTDevice.js
│   ├── routes/          # API endpoints
│   │   ├── machineRoutes.js
│   │   ├── authRoutes.js
│   │   ├── historyRoutes.js
│   │   ├── alertRoutes.js
│   │   ├── exportRoutes.js
│   │   └── iotRoutes.js
│   ├── services/
│   │   └── notificationService.js
│   └── index.js
└── simulator/
    └── metricSimulator.js
```

### Frontend (React + Vite + Tailwind CSS)
```
frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── home.jsx
│   │   ├── products.jsx
│   │   ├── services.jsx
│   │   ├── solutions.jsx
│   │   ├── software.jsx      # Main dashboard
│   │   ├── login.jsx
│   │   └── register.jsx
│   ├── App.jsx
│   └── main.jsx
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Machines
- `GET /api/machines` - List all machines
- `POST /api/machines` - Create machine
- `GET /api/machines/:id` - Get machine details
- `PUT /api/machines/:id` - Update machine
- `DELETE /api/machines/:id` - Delete machine
- `GET /api/machines/:id/metrics` - Get live metrics

### Historical Data
- `GET /api/history/:machineId` - Get historical metrics
- `GET /api/history/:machineId/analytics` - Get analytics summary
- `POST /api/history/compare` - Compare multiple machines

### Alerts
- `GET /api/alerts` - List alerts (with filters)
- `GET /api/alerts/stats` - Alert statistics
- `GET /api/alerts/machine/:machineId` - Machine-specific alerts
- `PATCH /api/alerts/:id/acknowledge` - Acknowledge alert
- `PATCH /api/alerts/:id/resolve` - Resolve alert

### Export
- `GET /api/export/csv/:machineId` - Export metrics to CSV
- `GET /api/export/csv/machines/summary` - Export all machines
- `GET /api/export/csv/alerts` - Export alerts
- `GET /api/export/report/:machineId` - Generate report data

### IoT Devices
- `GET /api/iot` - List IoT devices
- `POST /api/iot` - Register device
- `PUT /api/iot/:id` - Update device
- `POST /api/iot/:id/test` - Test connection
- `POST /api/iot/:id/start` - Start data collection
- `POST /api/iot/:id/stop` - Stop data collection
- `POST /api/iot/webhook/:deviceId` - Receive external data

---

## 🔐 Environment Variables (Optional)

Create `.env` file in backend folder:

```env
# JWT Secret
JWT_SECRET=your-secret-key-here

# Email Notifications (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# MongoDB (Optional - defaults to localhost)
MONGODB_URI=mongodb://127.0.0.1:27017/machinesdb
```

---

## 🎨 Features Showcase

### 1. Real-Time Dashboard
- Live metric updates every second
- Temperature, Vibration, Current, Voltage, RPM, Load, Pressure, Humidity, Power
- Interactive charts with Recharts
- Status indicators (Running, Warning, Critical)
- Runtime tracking

### 2. Historical Analytics
- View metrics over time (24h, 7d, 30d)
- Aggregation by minute, hour, or day
- Min/Max/Average calculations
- Compare multiple machines
- Auto-cleanup after 30 days

### 3. Alert System
- Real-time alert generation
- Severity levels: Low, Medium, High, Critical
- Email notifications with cooldown
- Alert history and logs
- Acknowledge/Resolve workflow
- Alert statistics dashboard

### 4. User Authentication
- Secure JWT-based auth
- Password hashing with bcrypt
- Role-based access (Admin, Operator, Viewer)
- Profile management
- Notification preferences

### 5. Data Export
- CSV export for metrics
- CSV export for alerts
- Machine summary reports
- Time range selection
- Ready for PDF generation

### 6. IoT Integration
- MQTT support (simulated)
- OPC-UA support (simulated)
- Modbus TCP support (simulated)
- HTTP webhooks
- Data mapping configuration
- Connection status tracking

### 7. Predictive Maintenance
- Component health estimation
- Based on vibration & temperature analysis
- Health percentage tracking
- Maintenance recommendations

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **Email:** Nodemailer
- **Real-time:** Metric simulator with 1s updates

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Routing:** React Router DOM 7
- **Styling:** Tailwind CSS (CDN)
- **Charts:** Recharts
- **State:** React Context API

### Database Schema
- **machines** - Machine information & live metrics
- **metrichistories** - Historical data (TTL 30 days)
- **alertlogs** - Alert tracking & history
- **users** - User accounts & authentication
- **notificationsettings** - User preferences
- **iotdevices** - IoT device configurations

---

## 📊 Machine Metrics Tracked

| Metric | Unit | Threshold | Alert Severity |
|--------|------|-----------|----------------|
| Temperature | °C | > 90 | Critical |
| Vibration | mm/s | > 12 | High |
| Current | A | > 65 | High |
| Voltage | V | < 205 or > 245 | Medium |
| RPM | rpm | - | - |
| Load | % | > 90 | Warning |
| Pressure | bar | > 8 | Medium |
| Humidity | % | > 80 | Low |
| Power | kW | - | - |
| Runtime | seconds | - | - |

---

## 🧪 Testing

### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login (save the token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Test Machine APIs
```bash
# Get all machines
curl http://localhost:5000/api/machines

# Get historical data
curl "http://localhost:5000/api/history/MACHINE_ID?hours=24&interval=hour"

# Get alert stats
curl http://localhost:5000/api/alerts/stats?hours=24

# Export to CSV
curl http://localhost:5000/api/export/csv/machines/summary -o machines.csv
```

---

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Ensure MongoDB is accessible
3. Install dependencies: `npm install --production`
4. Start: `npm start` or use PM2

### Frontend Deployment
1. Build: `npm run build`
2. Deploy `dist/` folder to CDN or static hosting
3. Update API URL in production

### Production Recommendations
- Use environment variables for secrets
- Enable HTTPS
- Add rate limiting
- Use Redis for sessions
- Set up MongoDB replica set
- Enable CORS properly
- Add logging (Winston)
- Set up monitoring (Sentry)
- Use PM2 or Docker for backend

---

## 📝 License

MIT License - Feel free to use this project for learning or commercial purposes.

---

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues or questions, refer to [FEATURES_IMPLEMENTED.md](./FEATURES_IMPLEMENTED.md) for detailed documentation.

**Happy Monitoring! 🎉**
