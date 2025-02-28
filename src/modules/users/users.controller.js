import Router from 'express';

import * as service from './users.service.js';
import * as validators from './users.validator.js';
import { authenticate } from '../../middleware/auth/auth.middleware.js';
import { validation } from '../../middleware/validation/validate.middleware.js';
import fileUpload, { FileTypes } from '../../middleware/multer.js';
import { asyncHandler } from '../../middleware/error/errors.middleware.js';

const router = Router();

// Helper function to construct paths
const createPath = (api) => `/users/${api}`;

// * GET Routes 🚀
router.get(
    createPath('me'),
    validation(validators.getLoggedInUserProfile, { includeHeaders: true }),
    authenticate,
    asyncHandler(service.getLoggedInUserProfile)
);

router.get(
    createPath(':id'),
    validation(validators.getOtherUserProfile, { includeHeaders: true }),
    authenticate,
    asyncHandler(service.getOtherUserProfile)
);

// * POST Routes ✉️
router.post(
    createPath('updateUserPicture/:type'),
    fileUpload(FileTypes.IMAGES).single('attachments'),
    validation(validators.updateUserPicture, { includeHeaders: true, includeFiles: true }),
    authenticate,
    asyncHandler(service.updateUserPicture)
);

// * PATCH Routes 🛠️
router.patch(
    createPath('updateProfile'),
    validation(validators.updateProfile, { includeHeaders: true }),
    authenticate,
    asyncHandler(service.updateLoggedInUserProfile)
);

router.patch(
    createPath('updatePassword'),
    validation(validators.updatePassword, { includeHeaders: true }),
    authenticate,
    asyncHandler(service.updatePassword)
);

router.patch(
    createPath('delete/:id'),
    validation(validators.deleteUser, { includeHeaders: true, includeFiles: false }),
    authenticate,
    asyncHandler(service.softDeleteUser)
);

// * DELETE Routes ❌
router.delete(
    createPath('deleteUserPicture/:type'),
    validation(validators.deleteUserPicture, { includeHeaders: true, includeFiles: false }),
    authenticate,
    asyncHandler(service.deleteUserPicture)
);

export default router;
