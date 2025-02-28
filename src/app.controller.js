import successResponse from './middleware/success/success.middleware.js';
import userRouter from './modules/users/users.controller.js';
import authRouter from './modules/auth/auth.controller.js';
import jobsRouter from './modules/jobs/jobs.controller.js';
import chatRouter from './modules/chats/chats.controller.js';
import companyRouter from './modules/company/company.controller.js';
import adminRouter from './modules/admin/admin.controller.js';
import { errorMiddleware } from './middleware/error/errors.middleware.js';
import { socket } from './modules/chats/socket.io.js';
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './modules/admin/graphql/main.js';
import { altairExpress } from 'altair-express-middleware';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Bootstrap the server 🛠️✨
const bootstrap = (app, express) => {
    // Parse incoming requests with JSON payloads 📦
    app.use(express.json());

    // Add security middleware 🛡️
    app.use(helmet());

    // Add rate limiting middleware 🚫
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000, // limit each IP to 100 requests per windowMs
        })
    );

    // Set up the GraphQL handler with the defined schema 🧩
    const handler = createHandler({ schema: schema });

    // Enable CORS to allow cross-origin requests 🌐
    app.use(
        cors({
            origin: '*', // Allow all origins ✨
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods 📡
            allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers 🏷️
        })
    );

    // Add success response middleware 🔥
    app.use(successResponse);

    // Register API routes 📑
    app.use('/api', [userRouter, authRouter, companyRouter, jobsRouter, chatRouter, adminRouter]);

    // Set up GraphQL endpoint 🌱
    app.use('/graphql', handler);

    // Set up Altair GraphQL playground for testing queries 🛸
    app.use('/altair', altairExpress({ endpointURL: '/graphql' }));

    // Add error handling middleware 🛑
    app.use(errorMiddleware);

    // Initialize socket connection for real-time chat ⚡
    socket();
};

export default bootstrap;
