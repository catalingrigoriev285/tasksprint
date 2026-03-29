require('dotenv').config();

const express = require('express');

const cors = require('cors');
const path = require('path');
const connectToDatabase = require('./config/database');

const authRoutes = require('./routes/auth.route');
const reportRoutes = require('./routes/report.route');
const taskRoutes = require('./routes/task.route');
const userRoutes = require('./routes/user.route');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Database
connectToDatabase();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
// app.use('/api/reports', reportRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
