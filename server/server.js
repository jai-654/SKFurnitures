import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { serve } from 'inngest/express';

import connectDB from './config/db.js';
import { inngest } from './config/inngest.js';
import { functions } from './inngest/functions.js';

import { authRoutes, adminRoutes, productRoutes, reviewRoutes, addressRoutes, orderRoutes, paymentRoutes, chatRoutes } from './routes/index.js';

import errorHandler from './middleware/errorHandler.js';

await connectDB();

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/inngest', serve({ client: inngest, functions }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

app.use(errorHandler);

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`API: http://localhost:${PORT}/api`);
});

export default app;
