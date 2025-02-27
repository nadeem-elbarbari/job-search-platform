import { Router } from 'express';
import { acceptOrRejectApplicant, addJob, addJobApplication, getAllCompanyJobs, getAllJobs, getJobApplications } from './jobs.service.js';
import { authenticate, authorization } from '../../middleware/auth/auth.middleware.js';
import { UserRoles } from '../../utils/enums/index.js';
import fileUpload, { FileTypes } from '../../middleware/multer.js';
import { asyncHandler } from '../../middleware/error/errors.middleware.js';

const router = Router({ mergeParams: true });

const createPath = (path = '') => (path ? `/jobs/${path}` : '/jobs');

// GET routes
router.get(createPath('applications/:jobId'), authenticate, asyncHandler(getJobApplications));

router.get(createPath(':companyId/:jobId?'), asyncHandler(getAllCompanyJobs));
router.get(createPath(), getAllJobs);

// POST routes
router.post(createPath('create'), authenticate, asyncHandler(addJob));

router.post(
    createPath('applyToJob/:jobId'),
    fileUpload([...FileTypes.DOCUMENTS]).single('attachment'),
    authenticate,
    authorization(UserRoles.USER),
    asyncHandler(addJobApplication)
);

// PATCH routes
router.patch(createPath('applicationStatus/:applicationId'), authenticate, asyncHandler(acceptOrRejectApplicant));

export default router;
