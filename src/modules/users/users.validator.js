import Joi from 'joi';
import generalFields from '../../utils/Joi/generals.js';

export const updatePassword = Joi.object({
    currentPassword: generalFields.password.required().messages({
        'any.required': 'Current password is required',
        'string.empty': 'Current password is required',
        'string.base': 'Current password must be a string',
        'string.min': 'Current password must be at least 8 characters long',
        'string.max': 'Current password must be at most 20 characters long',
        'string.valid': 'Current password must match the password',
    }),
    newPassword: generalFields.password.required().messages({
        'any.required': 'New password is required',
        'string.empty': 'New password is required',
        'string.base': 'New password must be a string',
        'string.min': 'New password must be at least 8 characters long',
        'string.max': 'New password must be at most 20 characters long',
        'string.valid': 'New password must match the password',
    }),
    rePassword: Joi.string().min(8).max(20).valid(Joi.ref('newPassword')).required().messages({
        'any.required': 'Re-password is required',
        'string.empty': 'Re-password is required',
        'string.base': 'Re-password must be a string',
        'string.min': 'Re-password must be at least 8 characters long',
        'string.max': 'Re-password must be at most 20 characters long',
        'string.valid': 'Re-password must match the password',
        'any.only': 'Re-password must match the password',
    }),
    authorization: generalFields.authorization.required(),
});

export const getOtherUserProfile = Joi.object({
    id: generalFields.id.required(),
    authorization: generalFields.authorization.required(),
});

export const getLoggedInUserProfile = Joi.object({
    authorization: generalFields.authorization.required(),
});

export const updateProfile = Joi.object({
    firstName: generalFields.firstName,
    lastName: generalFields.lastName,
    phoneNumber: generalFields.phoneNumber,
    birthDate: generalFields.birthDate,
    gender: generalFields.gender,
    authorization: generalFields.authorization.required(),
}).or('firstName', 'lastName', 'phoneNumber', 'birthDate', 'gender');

export const updateUserPicture = Joi.object({
    type: Joi.string().valid('profile', 'cover').required().messages({
        'any.only': "Value of type must be 'profile' or 'cover'",
        'any.required': 'Type is required.',
    }),
    attachments: generalFields.attachments.required(),
    authorization: generalFields.authorization.required(),
});

export const deleteUserPicture = Joi.object({
    type: Joi.string().valid('profile', 'cover').required().messages({
        'any.only': "Value of type must be 'profile' or 'cover'",
        'any.required': 'Type is required.',
    }),
    authorization: generalFields.authorization.required(),
});

export const deleteUser = Joi.object({
    id: generalFields.id.required(),
    authorization: generalFields.authorization.required(),
});
