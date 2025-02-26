import Joi from 'joi';
import generalFields from '../../utils/Joi/generals.js';

export const register = Joi.object({
    firstName: generalFields.firstName.required(),
    lastName: generalFields.lastName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    rePassword: Joi.string().min(8).max(20).valid(Joi.ref('password')).required().messages({
        'any.required': 'Re-password is required',
        'string.empty': 'Re-password is required',
        'string.base': 'Re-password must be a string',
        'string.min': 'Re-password must be at least 8 characters long',
        'string.max': 'Re-password must be at most 20 characters long',
        'string.valid': 'Re-password must match the password',
    }),
    phoneNumber: generalFields.phoneNumber.required(),
    birthDate: generalFields.birthDate.required(),
    gender: generalFields.gender.required(),
});

export const logIn = Joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
});

export const confirmEmail = Joi.object({
    email: generalFields.email.required(),
    code: Joi.string().length(6).required().messages({
        'any.required': 'Code is required',
        'string.empty': 'Code is required',
        'string.base': 'Code must be a string',
        'string.length': 'Code must be exactly 6 characters long',
    }),
});

export const getForgotPasswordOtp = Joi.object({
    email: generalFields.email.required(),
});

export const resetPassword = Joi.object({
    email: generalFields.email.required(),
    code: Joi.string().length(6).required().messages({
        'any.required': 'Code is required',
        'string.empty': 'Code is required',
        'string.base': 'Code must be a string',
        'string.length': 'Code must be exactly 6 characters long',
    }),
    newPassword: generalFields.password.required(),
    rePassword: Joi.string().min(8).max(20).valid(Joi.ref('newPassword')).required().messages({
        'any.required': 'Re-password is required',
        'string.empty': 'Re-password is required',
        'string.base': 'Re-password must be a string',
        'string.min': 'Re-password must be at least 8 characters long',
        'string.max': 'Re-password must be at most 20 characters long',
        'string.valid': 'Re-password must match the password',
    }),
});

export const refreshToken = Joi.object({
    authorization: generalFields.authorization.required(),
});
