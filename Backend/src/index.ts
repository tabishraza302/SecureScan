import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';

import Logger from './utils/logger/Logger';
import Database from './database/Database';
import ErrorHandler from './utils/ErrorHandler';
import IndexRoutes from './routes/Index.Routes';
import ErrorMiddleware from './middlewares/Error.Middleware';
import MorganMiddleware from './middlewares/Morgan.Middleware';

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.ORIGIN || '*' }));

app.use(MorganMiddleware);

app.use(IndexRoutes);

app.use((req, res, next) =>
    next(new ErrorHandler(404, `Cannot find ${req.originalUrl} on this server`))
); // Handles 404 routes
app.use(ErrorMiddleware);

console.log('Starting database sync...');
Database.sync({ alter: false, force: false })
    .then(() => {
        console.log('Database synced successfully');
        app.listen(port, () => console.log(`Server started on port ${port}`));
    })
    .catch((error) => {
        console.error('Database sync failed:', error);
        process.exit(1);
    });
