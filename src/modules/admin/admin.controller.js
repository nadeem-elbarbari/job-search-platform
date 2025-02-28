import { Router } from 'express';
import { asyncHandler } from '../../middleware/error/errors.middleware.js';
import * as service from './admin.service.js';
import * as validators from './admin.validators.js';
import { authenticate, authorization } from '../../middleware/auth/auth.middleware.js';
import { UserRoles } from '../../utils/enums/index.js';
import { validation } from '../../middleware/validation/validate.middleware.js';

const router = Router();

// Helper function to create the dynamic path for admin actions
const createPath = (path) => `/admin/${path}`;

// Route to handle user actions (ban/unban). Only admins can execute these actions.
router.post(
    createPath('userActions/:userId/:action'),
    validation(validators.banOrUnbanUser, { includeHeaders: true }),
    authenticate,
    authorization(UserRoles.ADMIN),
    asyncHandler(service.banOrUnbanUser)
);

// Route to handle company actions (ban/unban). Only admins can execute these actions.
router.post(
    createPath('companyActions/:companyId/:action'),
    validation(validators.banOrUnbanCompany, { includeHeaders: true }),
    authenticate,
    authorization(UserRoles.ADMIN),
    asyncHandler(service.banOrUnbanCompany)
);

// Route to approve a company. Admin will approve companies after review.
router.post(
    createPath('approve/:companyId'),
    validation(validators.approveCompany, { includeHeaders: true }),
    authenticate,
    authorization(UserRoles.ADMIN),
    asyncHandler(service.approveCompany)
);

export default router;
