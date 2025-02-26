import Router from 'express';

import * as service from './users.service.js';
import * as validators from './users.validator.js';
import { authenticate } from '../../middleware/auth/auth.middleware.js';
import { validation } from '../../middleware/validation/validate.middleware.js';
import fileUpload, { FileTypes } from '../../middleware/multer.js';

const router = Router();

// Helper function to construct paths
const createPath = (api) => `/users/${api}`;

// GET routes
router.get(
    createPath('me'),
    authenticate,
    validation(validators.getLoggedInUserProfile, { includeHeaders: true }),
    service.getLoggedInUserProfile
);

router.get(
    createPath(':id'),
    authenticate,
    validation(validators.getOtherUserProfile, { includeHeaders: true }),
    service.getOtherUserProfile
);

// POST routes
router.post(
    createPath('updateUserPicture/:type'),
    fileUpload(FileTypes.IMAGES).single('attachments'),
    validation(validators.updateUserPicture, { includeHeaders: true, includeFiles: true }),
    authenticate,
    service.updateUserPicture
);

// PATCH routes
router.patch(
    createPath('updateProfile'),
    authenticate,
    validation(validators.updateProfile, { includeHeaders: true }),
    service.updateLoggedInUserProfile
);

router.patch(
    createPath('updatePassword'),
    authenticate,
    validation(validators.updatePassword, { includeHeaders: true }),
    service.updatePassword
);

router.patch(
    createPath('delete/:id'),
    validation(validators.deleteUser, { includeHeaders: true, includeFiles: false }),
    authenticate,
    service.softDeleteUser
);

// DELETE routes
router.delete(
    createPath('deleteUserPicture/:type'),
    validation(validators.deleteUserPicture, { includeHeaders: true, includeFiles: false }),
    authenticate,
    service.deleteUserPicture
);

export default router;
