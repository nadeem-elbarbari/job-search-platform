import Router from 'express';
import * as service from './auth.service.js';
import * as validators from './auth.validator.js';
import { validation } from '../../middleware/validation/validate.middleware.js';
import { asyncHandler } from '../../middleware/error/errors.middleware.js';

const router = Router();

// Helper function to construct paths
const createPath = (api) => `/auth/${api}`;

// POST routes
router.post(createPath('register'), validation(validators.register), asyncHandler(service.register));

router.post(createPath('logIn'), validation(validators.logIn), asyncHandler(service.logIn));

router.post(createPath('googleAuth'), asyncHandler(service.googleAuth));

router.post(createPath('confirmEmail'), validation(validators.confirmEmail), asyncHandler(service.emailConfirmation));

router.post(createPath('forgotPassword'), validation(validators.getForgotPasswordOtp), asyncHandler(service.getForgotPasswordOtp));

router.post(createPath('resetPassword'), validation(validators.resetPassword), asyncHandler(service.resetPassword));

router.post(
    createPath('refreshToken'),
    validation(validators.refreshToken, { includeHeaders: true }),
    asyncHandler(service.refreshToken)
);

export default router;