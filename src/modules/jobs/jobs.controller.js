// Importing necessary modules
import { Router } from 'express'; // Express router
import {
    acceptOrRejectApplicant, // Function to accept or reject an applicant
    addJob, // Function to add a new job
    addJobApplication, // Function to apply for a job
    getAllCompanyJobs, // Function to get jobs for a specific company
    getAllJobs, // Function to get all jobs
    getJobApplications, // Function to get applications for a job
    updateJob, // Function to update a job
} from './jobs.service.js'; // Job service functions
import { authenticate, authorization } from '../../middleware/auth/auth.middleware.js'; // Auth middleware
import { UserRoles } from '../../utils/enums/index.js'; // User roles
import fileUpload, { FileTypes } from '../../middleware/multer.js'; // File upload middleware
import { asyncHandler } from '../../middleware/error/errors.middleware.js'; // Error handler
import * as validators from './jobs.validators.js'; // Validation functions
import { validation } from '../../middleware/validation/validate.middleware.js'; // Validation middleware

// Initialize the router
const router = Router({ mergeParams: true });

// Helper function to create job routes
const createPath = (path = '') => (path ? `/jobs/${path}` : '/jobs');

// * GET routes 🔍
// Fetch all applications for a job
router.get(createPath('applications/:jobId'), authenticate, asyncHandler(getJobApplications));

// Fetch jobs for a specific company (with optional jobId)
router.get(createPath(':companyId/:jobId?'), asyncHandler(getAllCompanyJobs));

// Fetch all jobs
router.get(createPath(), getAllJobs);

// * POST routes 📝
// Add a new job
router.post(
    createPath('create'),
    validation(validators.addJob, { includeHeaders: true }),
    authenticate,
    asyncHandler(addJob)
);

// Apply to a job (with file upload for attachments)
router.post(
    createPath('applyToJob/:jobId'),
    fileUpload([...FileTypes.DOCUMENTS]).single('attachments'),
    validation(validators.addJobApplication, { includeHeaders: true, includeFiles: true }),
    authenticate,
    authorization(UserRoles.USER),
    asyncHandler(addJobApplication)
);

// * PATCH routes ⚙️
// Accept or reject an applicant
router.patch(
    createPath('applicationStatus/:applicationId'),
    validation(validators.acceptOrRejectApplicant, { includeHeaders: true }),
    authenticate,
    authorization(UserRoles.ADMIN),
    asyncHandler(acceptOrRejectApplicant)
);

// Update a job
router.patch(
    createPath('update/:jobId'),
    validation(validators.updateJob, { includeHeaders: true }),
    authenticate,
    asyncHandler(updateJob)
);

// Export the router to use in the main app
export default router;
