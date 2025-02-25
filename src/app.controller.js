import { errorMiddleWare } from './middleware/error/errors.middleware.js';
import successResponse from './middleware/success/success.middleware.js';
import userRouter from './modules/users/users.controller.js';
import authRouter from './modules/auth/auth.controller.js';
import cors from 'cors';

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

    app.use('/api', [userRouter, authRouter]);

    app.use(errorMiddleWare);
};

export default bootstrap;
