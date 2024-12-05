import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import { connectDB } from './lib/db.js';

import { app, server } from './lib/socket.js'
// const app = express();

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// ROutes Import
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';

// Middlewares
const corsOptions = {
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth/', userRoutes);
app.use('/api/chat/', chatRoutes);


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'))
    })
}


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
