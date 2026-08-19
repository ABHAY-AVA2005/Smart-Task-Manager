// server.js – entry point for the Express API
// Configures middleware, routes, security headers, and global error handling
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet'; // security headers
import xss from 'xss-clean'; // sanitize user input
import mongoSanitize from 'express-mongo-sanitize'; // prevent NoSQL injection
import rateLimit from 'express-rate-limit'; // basic DoS protection
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables from .env file
dotenv.config();

// Establish MongoDB connection
connectDB();

const app = express();

// ---- Security middleware configuration ----
app.use(cors({
  origin: '*', // TODO: Restrict to allowed origins in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(helmet()); // set secure HTTP headers
app.use(xss()); // protect against XSS attacks
app.use(mongoSanitize()); // protect against NoSQL injection

// Rate limiting: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Parse JSON bodies
app.use(express.json());

// ---- API routes ----
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Catch‑all for unknown routes – returns 404 JSON response
app.use(notFound);
// Centralized error handling middleware – ensures consistent error format
app.use(errorHandler);

const PORT = process.env.PORT || 5000; // fallback for local dev

app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
