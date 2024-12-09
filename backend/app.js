require('./tasks/penaltyUpdater');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require("socket.io")
const http = require('http');
const errorHandler = require('./middlewares/errorMiddleware'); // Import the error middleware
const { protect } = require('./middlewares/authMiddleware');
const { initializeSocket } = require('./socket/socketServer');

// Import routes
const chatRoutes = require('./routes/chatRoutes');
const communityRoutes = require('./routes/communityRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize socket.io
const io = initializeSocket(server);
app.set('io', io);

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
app.use(morgan('dev'));

connectDB();

// Sample Route to test the protect middlewar
app.get('/protected', protect, (req, res) => {
  res.json({
    message: 'Access granted!',
    user: req.user,
    residents: req.residents,
  });
});


// Auth routes
app.use('/api/auth', require('./routes/auth'));

// society routes 
app.use('/api/society', require('./routes/society'));

// Important numbers routes
app.use('/api/important-numbers', require('./routes/importantNumber'));

// Resident management routes
app.use('/api/residents', require('./routes/resident'));

// Middleware to protect routes
app.use('/api/financial', require('./routes/financialRoutes'));

//other income routes 
app.use('/api/other-income', require('./routes/otherIncomeRoutes'));

// payments routes 
// app.use('/api/payments', require('./routes/paymentRoutes'));

// visitors log routes 
app.use('/api/visitor-logs', require('./routes/visitorLogRoutes'));

// security guards routes 
app.use('/api/security-guards', require('./routes/securityGuardRoutes'));

// Expense routes
app.use('/api/expenses', require('./routes/expenseRoutes'));

// note routes 
app.use('/api/notes', require('./routes/noteRoutes'));

// facilities routes
app.use('/api/facilities', require("./routes/facilityRoutes"));

// Complaints routes
app.use('/api/complaints', require("./routes/complaintRoutes"));

// Requests routes
app.use('/api/requests', require('./routes/requestRoutes'));

// security protocol routes
app.use('/api/security-protocols', require("./routes/securityProtocolRoutes"));

// announcement routes
app.use('/api/announcements', require("./routes/announcementRoutes"));

//emergency routes
app.use('/api/emergency-alerts', require("./routes/emergencyRoutes"));

// polls
app.use('/api/polls', require('./routes/pollRoutes'));

//chat
app.use('/api/chat', protect, chatRoutes);

//community routes
app.use('/api/community', protect, communityRoutes);

// Health check routes
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

//  commen get api
app.get('/', (req, res) => {
  res.status(200).send("done bhai bas hogaya 😞 🎉")
});


// Use the error handling middleware after all routes
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
// server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
