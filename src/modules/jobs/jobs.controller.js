import { Router } from 'express';
import {
    acceptOrRejectApplicant,
    addJob,
    addJobApplication,
    getAllCompanyJobs,
    getAllJobs,
    getJobApplications,
    updateJob,
} from './jobs.service.js';
import { authenticate, authorization } from '../../middleware/auth/auth.middleware.js';
import { UserRoles } from '../../utils/enums/index.js';
import fileUpload, { FileTypes } from '../../middleware/multer.js';
import { asyncHandler } from '../../middleware/error/errors.middleware.js';
import * as validators from './jobs.validators.js';
import { validation } from '../../middleware/validation/validate.middleware.js';

const router = Router({ mergeParams: true });

// Helper function to construct paths
const createPath = (path = '') => (path ? `/jobs/${path}` : '/jobs');

// * GET routes 🔍
router.get(createPath('applications/:jobId'), authenticate, asyncHandler(getJobApplications)); // 🔍 Fetch all job applications

router.get(createPath(':companyId/:jobId?'), asyncHandler(getAllCompanyJobs)); // 🔍 Fetch jobs for a specific company

router.get(createPath(), getAllJobs); // 🔍 Fetch all jobs

// * POST routes 📝
router.post(
    createPath('create'),
    validation(validators.addJob, { includeHeaders: true }),
    authenticate,
    asyncHandler(addJob)
); // 📝 Add a new job

router.post(
    createPath('applyToJob/:jobId'),
    fileUpload([...FileTypes.DOCUMENTS]).single('attachments'),
    validation(validators.addJobApplication, { includeHeaders: true, includeFiles: true }),
    authenticate,
    authorization(UserRoles.USER),
    asyncHandler(addJobApplication)
); // 📝 Apply to a job

// * PATCH routes ⚙️
router.patch(
    createPath('applicationStatus/:applicationId'),
    validation(validators.acceptOrRejectApplicant, { includeHeaders: true }),
    authenticate,
    authorization(UserRoles.ADMIN),
    asyncHandler(acceptOrRejectApplicant)
); // ⚙️ Accept or reject an applicant

router.patch(
    createPath('update/:jobId'),
    validation(validators.updateJob, { includeHeaders: true }),
    authenticate,
    asyncHandler(updateJob)
); // ⚙️ Update a job

export default router;
