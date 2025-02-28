import { Application } from '../../database/models/Application.model.js';
import { Company } from '../../database/models/Company.models.js';
import { JobOpportunity } from '../../database/models/JobOpportunity.model.js';
import { handleError } from '../../middleware/error/errors.middleware.js';
import cloudinary from '../../utils/cloudinary.js';
import { EmailEvent } from '../../utils/OTP/otp.js';

// * POST route 📝: Add a new job
export const addJob = async (req, res, next) => {
    const jobData = req.body;
    const creatorId = req.user._id;

    const company = await Company.findOne({
        $or: [{ HRs: creatorId }, { createdBy: creatorId }],
    });

    if (!company) {
        return handleError('You are not authorized to add a job for this company', 403, next);
    }

    const newJob = await JobOpportunity.create({
        ...jobData,
        addedBy: creatorId,
        companyId: company._id,
    });

    res.success(newJob, '✅ Job added successfully');
};

// * PATCH route ⚙️: Update an existing job
export const updateJob = async (req, res, next) => {
    const { jobId } = req.params;
    const jobUpdates = req.body;
    const userId = req.user._id;

    const job = await JobOpportunity.findById(jobId);
    if (!job) {
        return handleError('Job not found', 404, next);
    }

    const company = await Company.findOne({ _id: job.companyId, createdBy: userId });
    if (!company) {
        return handleError('You are not authorized to update this job', 403, next);
    }

    const updatedJob = await JobOpportunity.findByIdAndUpdate(jobId, jobUpdates, { new: true });

    res.success(updatedJob, '⚙️ Job updated successfully');
};

// * DELETE route 🗑️: Delete a job
export const deleteJob = async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.user._id;

    const job = await JobOpportunity.findById(jobId);
    if (!job) {
        return handleError('Job not found', 404, next);
    }

    const company = await Company.findOne({ _id: job.companyId, HRs: userId });
    if (!company) {
        return handleError('You are not authorized to delete this job', 403, next);
    }

    await JobOpportunity.findByIdAndDelete(jobId);

    res.success(undefined, '🗑️ Job deleted successfully');
};

// * GET route 🔍: Fetch all jobs for a company
export const getAllCompanyJobs = async (req, res, next) => {
    const { companyId, jobId } = req.params;
    const { skip = 0, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

    const companyIsExists = await Company.findOne({ _id: companyId });
    if (!companyIsExists) return handleError('⛔ Company not found', 404, next);

    const query = {
        ...(companyId && { companyId }),
        ...(jobId && { _id: jobId }),
    };

    const jobs = await JobOpportunity.find(query)
        .sort({ [sort]: order === 'asc' ? 1 : -1 })
        .skip(Number(skip))
        .limit(Number(limit));

    const totalCount = await JobOpportunity.countDocuments(query);

    res.success({ totalCount, jobs: jobs.length > 0 ? jobs : "No jobs found" }, '🔍 Jobs fetched successfully');
};

// * GET route 🔍: Fetch all jobs with filters
export const getAllJobs = async (req, res, next) => {
    const {
        limit = 10,
        page = 1,
        sort = 'createdAt',
        order = 'desc',
        workingTime,
        jobLocation,
        seniorityLevel,
        jobTitle,
        technicalSkills,
    } = req.query;

    const query = {
        ...(workingTime && { workingTime }),
        ...(jobLocation && { jobLocation }),
        ...(seniorityLevel && { seniorityLevel }),
        ...(jobTitle && { jobTitle }),
        ...(technicalSkills && { technicalSkills }),
    };

    const currentPage = Number(page) > 0 ? Number(page) : 1;
    const resultsPerPage = Number(limit) > 0 ? Number(limit) : 10;

    const totalResults = await JobOpportunity.countDocuments(query);
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const remainingPages = Math.max(totalPages - currentPage, 0);
    const skipResults = (currentPage - 1) * resultsPerPage;

    let jobs;

    if (Object.keys(query).length > 0) {
        jobs = await JobOpportunity.find(query)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(Number(skipResults))
            .limit(Number(limit));
    } else {
        jobs = await JobOpportunity.find()
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(Number(skipResults))
            .limit(Number(limit));
    }

    res.success(
        { totalResults, jobs, paginationInfo: { totalPages, currentPage, resultsPerPage, remainingPages } },
        '🔍 Jobs fetched successfully'
    );
};

// * POST route 📝: Apply to a job
export const addJobApplication = async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.user._id;

    const job = await JobOpportunity.findById(jobId);
    if (!job) {
        return handleError('Job not found', 404, next);
    }

    if (!req.file) {
        return handleError('Please upload a CV', 400, next);
    }

    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
        return handleError('You have already applied to this job', 400, next);
    }

    const application = await Application.create({ jobId, userId });

    const applicant = await Application.findOne({ userId })
        .populate({ path: 'jobId', populate: { path: 'companyId' } })
        .populate('userId');

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/applications/${application._id}`,
        });

        application.userCV = { secure_url, public_id };
    }

    await application.save();

    EmailEvent.emit('applicationStatus', {
        email: applicant.userId.email,
        name: applicant.userId.userName,
        jobTitle: applicant.jobId.jobTitle,
        companyName: applicant.jobId.companyId.companyName,
        status: 'sent',
    });

    res.success(undefined, '📝 Application added successfully');
};

// * GET route 🔍: Fetch all applications for a job
export const getJobApplications = async (req, res, next) => {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId })
        .populate({ path: 'jobId', populate: { path: 'companyId' } })
        .populate('userId');

    res.success(applications, '🔍 Applications fetched successfully');
};

// * PATCH route ⚙️: Accept or reject an applicant
export const acceptOrRejectApplicant = async (req, res, next) => {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
        .populate({ path: 'jobId', populate: { path: 'companyId' } })
        .populate('userId');

    if (!application) {
        return handleError('Application not found', 404, next);
    }

    const company = await Company.findOne({
        _id: application.jobId.companyId,
        HRs: { $in: [req.user._id] },
    });

    if (!company) {
        return handleError('You are not authorized to accept or reject this application', 403, next);
    }

    if (!req.body.status) {
        return handleError('Please provide a status', 400, next);
    }

    application.status = req.body.status;
    await application.save();

    if (application.status) {
        EmailEvent.emit('applicationStatus', {
            email: application.userId.email,
            name: application.userId.userName,
            jobTitle: application.jobId.jobTitle,
            companyName: application.jobId.companyId.companyName,
            status: application.status,
        });
    }

    res.success(undefined, `⚙️ Application ${application.status} successfully`);
};
