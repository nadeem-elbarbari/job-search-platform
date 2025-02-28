import Router from 'express';
import * as service from './auth.service.js'; // Import authentication service methods
import * as validators from './auth.validator.js'; // Import validators for input validation
import { validation } from '../../middleware/validation/validate.middleware.js'; // Middleware for input validation
import { asyncHandler } from '../../middleware/error/errors.middleware.js'; // Middleware for handling errors asynchronously

const router = Router();

// Helper function to construct API paths dynamically
const createPath = (api) => `/auth/${api}`;

// * POST routes for Authentication 🛡️

router.post(createPath('register'), validation(validators.register), asyncHandler(service.register));
// Register a new user (Validates input using 'validators.register')

router.post(createPath('logIn'), validation(validators.logIn), asyncHandler(service.logIn));
// Log in an existing user (Validates input using 'validators.logIn')

router.post(createPath('googleAuth'), asyncHandler(service.googleAuth));
// Google authentication for logging in (No input validation needed)

router.post(createPath('confirmEmail'), validation(validators.confirmEmail), asyncHandler(service.emailConfirmation));
// Confirm email address (Validates input using 'validators.confirmEmail')

router.post(
    createPath('forgotPassword'),
    validation(validators.getForgotPasswordOtp),
    asyncHandler(service.getForgotPasswordOtp)
);
// Request password reset (Validates input using 'validators.getForgotPasswordOtp')

router.post(createPath('resetPassword'), validation(validators.resetPassword), asyncHandler(service.resetPassword));
// Reset password (Validates input using 'validators.resetPassword')

router.post(
    createPath('refreshToken'),
    validation(validators.refreshToken, { includeHeaders: true }), // Includes headers validation
    asyncHandler(service.refreshToken)
);
// Refresh JWT token (Validates input using 'validators.refreshToken' and includes header validation)

export default router;
