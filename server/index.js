const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: true, // This reflects the requested origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());

// Import Routes (To be created)
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const shelfRoutes = require('./routes/shelf');
const reviewRoutes = require('./routes/reviews');
const analyticsRoutes = require('./routes/analytics');
const aiRoutes = require('./routes/ai');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/shelf', shelfRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Database Connection
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\x1b[36m🚀\x1b[0m Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
});

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});
