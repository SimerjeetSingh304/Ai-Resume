import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
    origin: [
        'http://localhost:5173', // Local frontend
        'https://ai-resume-brown.vercel.app', // Production frontend
        'https://ai-resume-qdc8.vercel.app', // Current frontend deployment
        'https://ai-resume-bttu.vercel.app', // New frontend deployment
        process.env.CORS_ORIGIN // In case the user adds it to .env later
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

// Routes Setup
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Resume API Routes (Unauthenticated via Clerk, expects x-user-id header)
app.use('/api/resume', resumeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
