import { Router } from 'express';
import * as service from './company.service.js';
import * as validators from './company.validators.js';
import { authenticate } from '../../middleware/auth/auth.middleware.js';
import { validation } from '../../middleware/validation/validate.middleware.js';
import { asyncHandler } from '../../middleware/error/errors.middleware.js';
import fileUpload, { FileTypes } from '../../middleware/multer.js';

const router = Router();

// Helper function to generate the path dynamically
const createPath = (path) => `/company/${path}`;

// GET Routes
router.get(createPath(':companyId/applications/export'), authenticate, asyncHandler(service.exportToExcel));
// Route for searching companies by name
// Uses the 'searchByName' service to filter companies by the given search query
router.get(createPath('search'), asyncHandler(service.searchByName));

// Route to fetch company details by companyId
// Fetches data for a single company using the companyId in the URL parameter
router.get(
    createPath(':companyId'),
    validation(validators.getCompany, { includeHeaders: true }),
    asyncHandler(service.getCompany)
);

// POST Routes

// Route to create a new company
// - Uses 'fileUpload' to allow uploading of legalAttachments (like contracts, documents, etc.)
// - The 'createCompany' validator ensures that the incoming request data is valid
// - Authentication is required to create a company
router.post(
    createPath('create'),
    fileUpload([...FileTypes.IMAGES, ...FileTypes.DOCUMENTS]).array('legalAttachments'), // Handle file uploads for multiple files (images & documents)
    validation(validators.createCompany, { includeHeaders: true, includeFiles: true }, 'legalAttachments'), // Validate the body and files
    authenticate, // Ensure the user is authenticated to create a company
    asyncHandler(service.createCompany) // Handle the logic for creating a new company in the database
);

// Route to upload company logo and cover image
// - The 'uploadLogoAndCover' validator ensures the request data is correct
// - Only images are allowed for this upload (no documents)
router.post(
    createPath('uploadLogoAndCover/:companyId/:type'),
    fileUpload(FileTypes.IMAGES).single('attachments'), // Handle single file upload for images (logo or cover)
    validation(validators.uploadLogoAndCover, { includeHeaders: true, includeFiles: true }), // Validate the request and the uploaded file
    authenticate, // Ensure the user is authenticated
    asyncHandler(service.uploadLogoAndCover) // Upload the logo and cover for the specified company
);

// PATCH Routes

// Route to update company details
// - The 'updateCompany' validator ensures that the incoming request is in the correct format
router.patch(
    createPath('update/:companyId'),
    validation(validators.updateCompany, { includeHeaders: true }), // Validate the request body
    authenticate, // Ensure the user is authenticated before updating the company
    asyncHandler(service.updateCompany) // Handle the company update logic
);

// Route to delete a company (soft delete)
router.patch(
    createPath('delete/:companyId'),
    validation(validators.deleteCompany, { includeHeaders: true }), // Validate the request body
    authenticate, // Ensure the user is authenticated before deleting
    asyncHandler(service.deleteCompany) // Handle the company deletion logic
);

// DELETE Routes

// Route to delete a company picture (logo or cover)
router.delete(createPath('deletePicture/:companyId/:type'), authenticate, asyncHandler(service.deletePicture));

export default router;
