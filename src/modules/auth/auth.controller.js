import Router from 'express';
import * as service from './auth.service.js';
import * as validators from './auth.validator.js';
import { validation } from '../../middleware/validation/validate.middleware.js';

const router = Router();

// Helper function to construct paths
const createPath = (api) => `/auth/${api}`;

// POST routes
router.post(createPath('register'), validation(validators.register), service.register);

router.post(createPath('logIn'), validation(validators.logIn), service.logIn);

router.post(createPath('googleAuth'), service.googleAuth);

router.post(createPath('confirmEmail'), validation(validators.confirmEmail), service.emailConfirmation);

router.post(createPath('forgotPassword'), validation(validators.getForgotPasswordOtp), service.getForgotPasswordOtp);

router.post(createPath('resetPassword'), validation(validators.resetPassword), service.resetPassword);

router.post(createPath('refreshToken'), validation(validators.refreshToken), service.refreshToken);

export default router;
