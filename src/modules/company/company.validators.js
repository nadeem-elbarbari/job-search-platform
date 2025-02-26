import Joi from 'joi';
import { numberOfEmployees } from '../../utils/enums/index.js';
import generalFields from '../../utils/Joi/generals.js';

const companyFields = {
    companyName: Joi.string().required().messages({
        'any.required': 'Company name is required',
        'string.empty': 'Company name is required',
        'string.base': 'Company name must be a string',
    }),

    companyEmail: Joi.string().email().required().messages({
        'any.required': 'Company email is required',
        'string.empty': 'Company email is required',
        'string.base': 'Company email must be a string',
        'string.email': 'Company email must be a valid email address',
    }),

    companyAddress: Joi.string().required().messages({
        'any.required': 'Company address is required',
        'string.empty': 'Company address is required',
        'string.base': 'Company address must be a string',
    }),

    description: Joi.string().required().messages({
        'any.required': 'Description is required',
        'string.empty': 'Description is required',
        'string.base': 'Description must be a string',
    }),

    industry: Joi.string().required().messages({
        'any.required': 'Industry is required',
        'string.empty': 'Industry is required',
        'string.base': 'Industry must be a string',
    }),

    numberOfEmployees: Joi.string()
        .valid(...Object.keys(numberOfEmployees))
        .required()
        .messages({
            'any.required': 'Number of employees is required',
            'string.empty': 'Number of employees is required',
            'string.base': 'Number of employees must be a string',
            'any.only': `Number of employees must be a ${Object.keys(numberOfEmployees).join(', ')}`,
        }),

    HRs: Joi.array().items(generalFields.id.required()).required().messages({
        'any.required': 'HR is required',
        'string.empty': 'HR is required',
        'string.base': 'HR must be a string',
        'string.custom': 'HR must be a type of ObjectId from MongoDB',
        custom: 'HR must be a type of ObjectId from MongoDB',
    }),
};

export const createCompany = Joi.object({
    ...companyFields,
    authorization: generalFields.authorization.required(),
    legalAttachments: generalFields.attachments.max(2).required().messages({
        'array.max': 'Maximum legal attachments is 2',
    }),
});

export const updateCompany = Joi.object({
    ...companyFields,
    authorization: generalFields.authorization,
    id: generalFields.id.required(),
});

export const deleteCompany = Joi.object({
    authorization: generalFields.authorization,
    id: generalFields.id.required(),
});

export const uploadLogoAndCover = Joi.object({
    authorization: generalFields.authorization,
    type: Joi.string().valid('logo', 'cover').required(),
    attachments: generalFields.attachments.required(),
    companyId: generalFields.id.required(),
});
