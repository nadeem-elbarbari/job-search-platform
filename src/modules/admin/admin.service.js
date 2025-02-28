import { Company } from '../../database/models/Company.models.js';
import User from '../../database/models/User.model.js';
import { handleError } from '../../middleware/error/errors.middleware.js';

export const banOrUnbanUser = async (req, res, next) => {
    try {
        const { userId, action } = req.params;

        if (action === 'ban') {
            // Check if user exists and is not already banned
            const user = await User.findOne({ _id: userId, bannedAt: { $exists: false } });
            if (!user) return handleError('⛔ User not found or already banned', 404, next);

            await User.findOneAndUpdate({ _id: userId }, { $set: { bannedAt: new Date() } }, { new: true });

            return res.success(undefined, '🚫 User banned successfully');
        }

        if (action === 'unban') {
            // Check if user exists and is banned
            const user = await User.findOne({ _id: userId, bannedAt: { $exists: true } });
            if (!user) return handleError('⛔ User not found or not banned', 404, next);

            await User.findOneAndUpdate({ _id: userId }, { $unset: { bannedAt: 1 } }, { new: true });

            return res.success(undefined, '✅ User unbanned successfully');
        }

        return next({ message: '⚠️ Invalid action', status: 400 });
    } catch (error) {
        next(error);
    }
};

export const banOrUnbanCompany = async (req, res, next) => {
    try {
        const { companyId, action } = req.params;

        if (action === 'ban') {
            // Ban the company
            const company = await Company.findOne({ _id: companyId, bannedAt: { $exists: false } });
            if (!company) return handleError('⛔ Company not found or already banned', 404, next);

            await Company.findOneAndUpdate({ _id: companyId }, { $set: { bannedAt: new Date() } }, { new: true });

            return res.success(undefined, '🚫 Company banned successfully');
        }

        if (action === 'unban') {
            // Unban the company
            const company = await Company.findOne({ _id: companyId, bannedAt: { $exists: true } });
            if (!company) return handleError('⛔ Company not found or not banned', 404, next);

            await Company.findOneAndUpdate({ _id: companyId }, { $unset: { bannedAt: 1 } }, { new: true });

            return res.success(undefined, '✅ Company unbanned successfully');
        }

        return handleError('⚠️ Invalid action', 400, next);
    } catch (error) {
        next(error);
    }
};

export const approveCompany = async (req, res, next) => {
    try {
        const { companyId } = req.params;

        const company = await Company.findOne({ _id: companyId });
        if (!company) return handleError('⛔ Company not found', 404, next);

        if (company.approvedByAdmin) return handleError('⛔ Company already approved', 400, next);

        await Company.findOneAndUpdate({ _id: companyId }, { $set: { approvedByAdmin: true } }, { new: true });

        return res.success(undefined, '🎉 Company approved successfully');
    } catch (error) {
        next(error);
    }
};
