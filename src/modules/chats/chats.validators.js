import Joi from 'joi';
import generalFields from '../../utils/Joi/generals.js';

const getChatHistory = Joi.object({
    userId: generalFields.id.required().messages({
        'any.required': 'User ID is required',
        'string.empty': 'User ID cannot be an empty string',
        'string.base': 'User ID must be a string',
        'string.custom': 'User ID must be a type of ObjectId from MongoDB',
        custom: 'User ID must be a type of ObjectId from MongoDB',
    }),
});

const sendMessage = Joi.object({
    userId: generalFields.id.required().messages({
        'any.required': 'User ID is required',
        'string.empty': 'User ID cannot be an empty string',
        'string.base': 'User ID must be a string',
        'string.custom': 'User ID must be a type of ObjectId from MongoDB',
        custom: 'User ID must be a type of ObjectId from MongoDB',
    }),
    content: Joi.string().required().messages({
        'any.required': 'Content is required',
        'string.empty': 'Content cannot be an empty string',
        'string.base': 'Content must be a string',
    }),
});

export { getChatHistory, sendMessage };
