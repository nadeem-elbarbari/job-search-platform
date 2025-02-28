import Joi from 'joi';
import generalFields from '../../utils/Joi/generals.js';

export const banOrUnbanUser = Joi.object({
    authorization: generalFields.authorization.required().messages({
        'any.required': 'Authorization is required.',
    }),
    userId: generalFields.id.required().messages({
        'any.required': 'User ID is required',
        'string.empty': 'User ID cannot be an empty string',
        'string.base': 'User ID must be a string',
        'string.custom': 'User ID must be a type of ObjectId from MongoDB',
        custom: 'User ID must be a type of ObjectId from MongoDB',
    }),
    action: Joi.string().required().valid('ban', 'unban').messages({
        'any.required': 'Action is required',
        'string.empty': 'Action cannot be an empty string',
        'string.base': 'Action must be a string',
        'any.only': 'Action must be either "ban" or "unban"',
    }),
});

export const banOrUnbanCompany = Joi.object({
    authorization: generalFields.authorization.required().messages({
        'any.required': 'Authorization is required.',
    }),
    companyId: generalFields.id.required().messages({
        'any.required': 'Company ID is required',
        'string.empty': 'Company ID cannot be an empty string',
        'string.base': 'Company ID must be a string',
        'string.custom': 'Company ID must be a type of ObjectId from MongoDB',
        custom: 'Company ID must be a type of ObjectId from MongoDB',
    }),
    action: Joi.string().required().valid('ban', 'unban').messages({
        'any.required': 'Action is required',
        'string.empty': 'Action cannot be an empty string',
        'string.base': 'Action must be a string',
        'any.only': 'Action must be either "ban" or "unban"',
    }),
});

export const approveCompany = Joi.object({
    authorization: generalFields.authorization.required().messages({
        'any.required': 'Authorization is required.',
    }),
    companyId: generalFields.id.required().messages({
        'any.required': 'Company ID is required',
        'string.empty': 'Company ID cannot be an empty string',
        'string.base': 'Company ID must be a string',
        'string.custom': 'Company ID must be a type of ObjectId from MongoDB',
        custom: 'Company ID must be a type of ObjectId from MongoDB',
    }),
});
