import { Router } from 'express';
import * as service from './chats.service.js';
import * as validators from './chats.validators.js';
import { authenticate } from '../../middleware/auth/auth.middleware.js';
import { asyncHandler } from '../../middleware/error/errors.middleware.js';
import { validation } from '../../middleware/validation/validate.middleware.js';

const router = Router();
const createPath = (path) => `/chats/${path}`;

router.get(
    createPath(':userId'),
    authenticate,
    validation(validators.getChatHistory),
    asyncHandler(service.getChatHistory)
);
router.post(
    createPath('send/:userId'),
    authenticate,
    validation(validators.sendMessage),
    asyncHandler(service.sendMessage)
);

export default router;
