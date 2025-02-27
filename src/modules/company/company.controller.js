import { Router } from 'express';
import * as service from './company.service.js';
import * as validators from './company.validators.js';
import { authenticate } from '../../middleware/auth/auth.middleware.js';
import { validation } from '../../middleware/validation/validate.middleware.js';
import { asyncHandler } from '../../middleware/error/errors.middleware.js';
import fileUpload, { FileTypes } from '../../middleware/multer.js';

const router = Router();
const createPath = (path) => `/company/${path}`;

// GET routes
router.get(createPath('search'), asyncHandler(service.searchByName));

router.get(createPath(':companyId'), asyncHandler(service.getCompany));

// POST routes

router.post(
    createPath('create'),
    fileUpload([...FileTypes.IMAGES, ...FileTypes.DOCUMENTS]).array('legalAttachments'),
    validation(validators.createCompany, { includeHeaders: true, includeFiles: true }, 'legalAttachments'),
    authenticate,
    asyncHandler(service.createCompany)
);

router.post(
    createPath('uploadLogoAndCover/:companyId/:type'),
    fileUpload(FileTypes.IMAGES).single('attachments'),
    validation(validators.uploadLogoAndCover, { includeHeaders: true, includeFiles: true }),
    authenticate,
    asyncHandler(service.uploadLogoAndCover)
);

// PATCH routes
router.patch(
    createPath('update/:companyId'),
    validation(validators.updateCompany, { includeHeaders: true }),
    authenticate,
    asyncHandler(service.updateCompany)
);

router.patch(
    createPath('delete/:companyId'),
    validation(validators.deleteCompany, { includeHeaders: true }),
    authenticate,
    asyncHandler(service.deleteCompany)
);

// DELETE routes
router.delete(createPath('deletePicture/:companyId/:type'), authenticate, asyncHandler(service.deletePicture));

export default router;
