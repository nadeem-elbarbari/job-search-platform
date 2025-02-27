import successResponse from './middleware/success/success.middleware.js';
import userRouter from './modules/users/users.controller.js';
import authRouter from './modules/auth/auth.controller.js';
import jobsRouter from './modules/jobs/jobs.controller.js';
import companyRouter from './modules/company/company.controller.js';
import cors from 'cors';
import { errorMiddleware } from './middleware/error/errors.middleware.js';

const bootstrap = (app, express) => {
    app.use(express.json());

    app.use(
        cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        })
    );

    app.use(successResponse);

    app.use('/api', [userRouter, authRouter, companyRouter, jobsRouter]);

    app.use(errorMiddleware);
};

export default bootstrap;
