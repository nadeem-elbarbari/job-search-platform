import { Company } from '../../database/models/Company.models.js';
import { handleError } from '../../middleware/error/errors.middleware.js';
import * as db from '../../database/db.service.js';
import { deletePictureFromCloudinary, updatePicture, uploadMultipleFiles } from '../../utils/cloudinary.js';
import { Application } from '../../database/models/Application.model.js';
import ExcelJS from 'exceljs';
import mongoose from 'mongoose';
import sendMail from '../../utils/nodemailer.js';

// Helper function to check Company existence by name or email
const checkCompanyExistence = async (companyName, companyEmail) => {
    const companyByName = await Company.findOne({
        companyName,
        deletedAt: { $exists: false },
        bannedAt: { $exists: false },
    });
    const companyByEmail = await Company.findOne({
        companyEmail,
        deletedAt: { $exists: false },
        bannedAt: { $exists: false },
    });

    if (companyByName) {
        return { companyByname: companyByName };
    }
    if (companyByEmail) {
        return { companyByEmail: companyByEmail };
    }
};

export const createCompany = async (req, res, next) => {
    const isExist = await checkCompanyExistence(req.body.companyName, req.body.companyEmail);

    // Check if company already exists
    if (isExist) return handleError('⚠️ Company name or email already exists 🙅‍♂️', 409, next);

    // Create a new company record in the database
    const newCompany = new Company(req.body);

    // Set the creator of the company to the logged-in user
    newCompany.createdBy = req.user._id;

    // Upload attachments to Cloudinary
    if (req.files) {
        const files = await uploadMultipleFiles(req.files, 'companies/attachments', newCompany._id);
        newCompany.legalAttachments = files;
    }

    await newCompany.save();

    // Respond with a success message
    res.success(newCompany, '🏢 Company created successfully! ✅');
};

export const updateCompany = async (req, res, next) => {
    const { companyId } = req.params;

    // Check if the company exists
    const company = await db.findOne(Company, {
        _id: companyId,
        deletedAt: { $exists: false },
        bannedAt: { $exists: false },
    });

    if (!company) return handleError('⛔ Company not found 🤒', 404, next);

    // Check if the logged-in user is the creator of the company
    if (req.user._id.toString() !== company.createdBy.toString())
        return handleError('🔒 Only the creator can update the company!', 403, next);

    // Update the company record in the database
    const updatedCompany = await Company.updateOne({ createdBy: req.user._id }, { $set: req.body });

    // Respond with a success message
    res.success(updatedCompany, '🔄 Company updated successfully! ✅');
};

export const deleteCompany = async (req, res, next) => {
    const { companyId } = req.params;

    // Check if the company exists
    const company = await db.findOne(Company, {
        _id: companyId,
        deletedAt: { $exists: false },
        bannedAt: { $exists: false },
    });

    if (!company) return handleError('⛔ Company not found 🤒', 404, next);

    // Check if the logged-in user is the creator of the company or an admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== company.createdBy.toString())
        return handleError('🔒 Only the creator or an admin can delete the company!', 403, next);

    // Perform soft delete by setting the `deletedAt` timestamp
    await Company.updateOne({ _id: companyId }, { $set: { deletedAt: Date.now() } });

    // Respond with a success message
    res.success(undefined, '🗑️ Company deleted successfully!');
};

export const searchByName = async (req, res, next) => {
    try {
        const { name, page = 1, limit = 10 } = req.query;

        // Convert page and limit to numbers and ensure they are positive only
        const currentPage = Number(page) > 0 ? Number(page) : 1;
        const resultsPerPage = Number(limit) > 0 ? Number(limit) : 10;

        // Define search filters
        const filterCriteria = {
            deletedAt: { $exists: false }, // Exclude deleted companies
            bannedAt: { $exists: false }, // Exclude banned companies
        };

        if (name) {
            filterCriteria.companyName = { $regex: name, $options: 'i' }; // Case-insensitive search
        }

        // Get total matching documents
        const totalResults = await Company.countDocuments(filterCriteria);

        // Calculate pagination values
        const totalPages = Math.ceil(totalResults / resultsPerPage);
        const remainingPages = Math.max(totalPages - currentPage, 0);
        const skipResults = (currentPage - 1) * resultsPerPage;

        // Fetch paginated results
        const companies = await Company.find(filterCriteria).skip(skipResults).limit(resultsPerPage);

        // Prepare response data
        const responseData = {
            paginationInfo: {
                totalResults,
                totalPages,
                currentPage,
                resultsPerPage,
                currentPageResults: companies.length,
                remainingPages,
            },
            companies,
        };

        // Send response
        res.success(responseData, '🔍 Companies found successfully!');
    } catch (error) {
        next(error);
    }
};

export const uploadLogoAndCover = async (req, res, next) => {
    const { companyId, type } = req.params;
    const company = await Company.findOne({ _id: companyId });
    if (!company) return handleError('⛔ Company Not Found', 404, next);

    if (company.createdBy.toString() !== req.user._id.toString())
        return handleError('⛔ Only the creator can update the company!', 403, next);

    const pictureType = type === 'cover' ? 'coverPicture' : 'logo';
    const data = await updatePicture(
        company,
        req.file,
        pictureType === 'coverPicture' ? 'coverPictures' : 'logo',
        pictureType
    );

    res.success(data[pictureType], `🖼️ ${pictureType.replace(/([A-Z])/g, ' $1').toLowerCase()} updated successfully!`);
};

export const deletePicture = async (req, res, next) => {
    const { type, companyId } = req.params;

    const company = await Company.findOne({ _id: companyId });
    if (!company) return handleError('⛔ Company Not Found', 400, next);

    if (company.createdBy.toString() !== req.user._id.toString())
        return handleError('⛔ Only the creator can update the company!', 403, next);

    const pictureType = type === 'cover' ? 'coverPicture' : 'logo';

    // Check if the picture exists
    if (!company[pictureType] || !company[pictureType].public_id) {
        return handleError('⚠️ Picture not found', 404, next);
    }

    await deletePictureFromCloudinary(company, pictureType);

    res.success(undefined, `🗑️ ${pictureType.replace(/([A-Z])/g, ' $1').toLowerCase()} deleted successfully!`);
};

export const getCompany = async (req, res, next) => {
    const { companyId } = req.params;

    const company = await Company.findById(companyId).populate('jobs');
    if (!company) return handleError('⛔ Company not found', 404, next);

    res.success(company, '🏢 Company found successfully!');
};

export const exportToExcel = async (req, res, next) => {
    // check if the logged-in user is the creator of the company or hr

    const { companyId } = req.params;
    const { date } = req.query;

    const company = await Company.findOne({ _id: companyId });
    if (!company) {
        return next(new Error('Company not found.'));
    }

    const hr = await Company.exists({ _id: companyId, hr: req.user._id });
    const owner = await Company.exists({ _id: companyId, createdBy: req.user._id }).lean();

    if (!owner && !hr) {
        return next(new Error('You are not authorized to export applications for this company.'));
    }

    if (!date) {
        return next(new Error('Date query parameter is required.'));
    }

    // Convert date to range (from start to end of the day)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch applications for jobs belonging to the specified company
    const applications = await Application.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
    })
        .populate({
            path: 'jobId',
            match: { companyId: new mongoose.Types.ObjectId(companyId) }, // Filter jobs by company
            select: 'jobTitle',
        })
        .populate('userId', 'firstName lastName email') // Get applicant details
        .lean();

    // Filter out applications where jobId doesn't match
    const filteredApplications = applications.filter((app) => app.jobId);

    if (filteredApplications.length === 0) {
        return res.status(404).json({ message: 'No applications found for this date.' });
    }

    // Create an Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Job Applications');

    // Define columns
    worksheet.columns = [
        { header: 'Applicant Name', key: 'name', width: 25 },
        { header: 'Applicant Email', key: 'email', width: 30 },
        { header: 'Job Title', key: 'jobTitle', width: 25 },
        { header: 'Application Status', key: 'status', width: 20 },
        { header: 'Applied Date', key: 'createdAt', width: 20 },
        { header: 'CV Link', key: 'cvLink', width: 50 },
    ];

    // Add rows to the worksheet
    filteredApplications.forEach((app) => {
        worksheet.addRow({
            name: app.userId.firstName + ' ' + app.userId.lastName,
            email: app.userId.email,
            jobTitle: app.jobId.jobTitle,
            status: app.status,
            createdAt: app.createdAt.toISOString().split('T')[0], // Format date
            cvLink: app.userCV?.secure_url || 'No CV Uploaded',
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    await sendMail(
        company.companyEmail,
        'Job Applications Report',
        '<p>Here is the job applications report for today.</p>',
        buffer,
        'Job_Applications.xlsx'
    );

    res.success(undefined, '✅ Job applications exported successfully!');
};
