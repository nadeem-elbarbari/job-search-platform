import User from '../../database/models/User.model.js';
import { handleError } from '../../middleware/error/errors.middleware.js';
import { Compare } from '../../utils/security/hash.js';
import { deletePictureFromCloudinary, updatePicture } from '../../utils/cloudinary.js';

// Update the logged-in user's profile with new data from the request body
export const updateLoggedInUserProfile = async (req, res, next) => {
    Object.assign(req.user, req.body);
    await req.user.save({ validateBeforeSave: false });
    res.success(undefined, '✅ Profile updated successfully!');
};

// Fetch the profile of the logged-in user, excluding sensitive fields
export const getLoggedInUserProfile = async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id }).select('-OTP -changeCredentialTime');
    if (!user) return handleError('⛔ Not Found', 404, next);
    res.success(user, '👤 Profile fetched successfully!');
};

// Fetch another user's profile based on their user ID
export const getOtherUserProfile = async (req, res, next) => {
    const otherUserId = req.params.id;
    const result = await User.findOne({
        _id: otherUserId,
        deletedAt: { $exists: false },
        bannedAt: { $exists: false },
    }).select('firstName lastName phoneNumber profilePicture coverPicture');
    if (!result) return handleError('⛔ Not Found', 404, next);
    res.success(result, '🔍 Profile fetched successfully!');
};

// Update the logged-in user's password after validating the current one
export const updatePassword = async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return handleError('⛔ Not Found', 404, next);

    const isMatch = Compare(currentPassword, user.password);
    if (!isMatch) return handleError('⚠️ Incorrect current password', 409, next);

    user.password = newPassword;
    await user.save();
    res.success(undefined, '🔑 Password updated successfully!');
};

// Update the logged-in user's profile picture or cover BASED ON THE TYPE (cover OR profile) using Cloudinary
export const updateUserPicture = async (req, res, next) => {
    const { type } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return handleError('⛔ Not Found', 404, next);

    const pictureType = type === 'cover' ? 'coverPicture' : 'profilePicture';
    const data = await updatePicture(
        user,
        req.file,
        pictureType === 'coverPicture' ? 'coverPictures' : 'profilePictures',
        pictureType
    );

    res.success(data[pictureType], `🖼️ ${pictureType.replace(/([A-Z])/g, ' $1').toLowerCase()} updated successfully!`);
};

// Delete the logged-in user's profile picture or cover picture from Cloudinary
export const deleteUserPicture = async (req, res, next) => {
    const { type } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return handleError('⛔ Not Found', 404, next);

    const pictureType = type === 'cover' ? 'coverPicture' : 'profilePicture';

    // Check if the picture exists
    if (!user[pictureType] || !user[pictureType].public_id) {
        return handleError('⚠️ Picture not found', 404, next);
    }

    await deletePictureFromCloudinary(user, pictureType);

    res.success(undefined, `🗑️ ${pictureType.replace(/([A-Z])/g, ' $1').toLowerCase()} deleted successfully!`);
};

// Soft Delete User
export const softDeleteUser = async (req, res, next) => {
    const { user } = req;
    const { id: userToDeleteId } = req.params;

    // Find the user to be deleted, ensuring they're not already deleted or banned
    const userToDelete = await User.findOne({
        _id: userToDeleteId,
        deletedAt: { $exists: false },
        bannedAt: { $exists: false },
    });

    if (!userToDelete) return handleError('⛔ User not found', 404, next);

    // Allow admins to delete any user and users can only delete themselves
    if (user.role !== 'admin' && userToDeleteId.toString() !== user._id.toString()) {
        return handleError('🚫 Not Allowed', 403, next);
    }

    // Perform soft delete by setting the `deletedAt` timestamp
    await User.findByIdAndUpdate(userToDeleteId, { deletedAt: Date.now() });

    res.success(undefined, '👤 User deleted successfully!');
};
