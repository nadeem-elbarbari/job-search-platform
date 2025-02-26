import Joi from 'joi';
import { Types } from 'mongoose';
import { UserGender, UserRoles } from '../enums/index.js';

// Helper functions remain the same

const customValidation = (value, error) => {
    const isValid = Types.ObjectId.isValid(value);
    return isValid ? value : error.message(`Invalid ID: ${value}`);
};

const createPatternValidation = (pattern, messages) => {
    return Joi.string().pattern(pattern).messages(messages);
};

const createStringField = (min, max, messages) => {
    return Joi.string().alphanum().min(min).max(max).messages(messages);
};

// General validation fields
const generalFields = {
    firstName: createStringField(3, 10, {
        'any.required': 'First name is required',
        'string.empty': 'First name is required',
        'string.base': 'First name must be a string',
    }),
    lastName: createStringField(3, 10, {
        'any.required': 'Last name is required',
        'string.empty': 'Last name is required',
        'string.base': 'Last name must be a string',
    }),
    email: createPatternValidation(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
        'any.required': 'Email is required',
        'string.empty': 'Email is required',
        'string.base': 'Email must be a string',
        'string.email': 'Email must be a valid email',
        'string.pattern.base': 'Email must be a valid email',
    }),
    password: createPatternValidation(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
        'any.required': 'Password is required',
        'string.empty': 'Password is required',
        'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character',
    }),
    phoneNumber: createPatternValidation(/^(010|011|012|015)[0-9]{8}$/, {
        'any.required': 'Phone is required',
        'string.empty': 'Phone is required',
        'string.base': 'Phone must be a string',
        'string.pattern.base': 'Phone must be a valid phone number',
    }),
    birthDate: Joi.date(),
    gender: Joi.string().valid(UserGender.MALE, UserGender.FEMALE),
    role: Joi.string().valid(UserRoles.ADMIN, UserRoles.USER),
    profilePicture: Joi.string(),
    coverPicture: Joi.string(),
    id: Joi.string().custom(customValidation).messages({
        'any.required': 'ID is required',
        'string.empty': 'ID is required',
        'string.base': 'ID must be a type of ObjectId from MongoDB',
        'string.custom': 'ID must be a type of ObjectId from MongoDB',
        custom: 'ID must be a type of ObjectId from MongoDB',
    }),
    authorization: Joi.string().required().messages({
        'any.required': 'Authorization header is required',
        'string.empty': 'Authorization header is required',
        'string.base': 'Authorization header must be a string',
    }),
    attachments: Joi.array()
        .items(
            Joi.object().keys({
                fieldname: Joi.string().required(),
                originalname: Joi.string().required(),
                encoding: Joi.string().required(),
                mimetype: Joi.string().required(),
                destination: Joi.string().optional(),
                filename: Joi.string().optional(),
                path: Joi.string().optional(),
                size: Joi.number()
                    .required()
                    .min(1)
                    .max(5 * 1024 * 1024),
            })
        )
        .min(1)
        .messages({
            'array.min': 'At least one file is required',
        }),
};

export default generalFields;
