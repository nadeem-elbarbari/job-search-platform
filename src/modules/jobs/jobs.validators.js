import Joi from 'joi';
import * as enums from '../../utils/enums/index.js';
import generalFields from '../../utils/Joi/generals.js';

const addJob = Joi.object({
    authorization: generalFields.authorization.required().messages({
        'any.required': 'Authorization is required.',
    }),

    jobTitle: Joi.string().trim().required().messages({
        'string.base': 'Job title must be a string.',
        'string.empty': 'Job title cannot be empty.',
        'any.required': 'Job title is required.',
    }),

    jobLocation: Joi.string()
        .valid(...Object.values(enums.jobLocation))
        .required()
        .messages({
            'string.base': 'Job location must be a string.',
            'any.only':
                'Job location must be one of the following: ' + Object.values(enums.jobLocation).join(', ') + '.',
            'any.required': 'Job location is required.',
        }),

    workingTime: Joi.string()
        .valid(...Object.values(enums.workingTime))
        .required()
        .messages({
            'string.base': 'Working time must be a string.',
            'any.only':
                'Working time must be one of the following: ' + Object.values(enums.workingTime).join(', ') + '.',
            'any.required': 'Working time is required.',
        }),

    seniorityLevel: Joi.string()
        .valid(...Object.values(enums.seniorityLevel))
        .required()
        .messages({
            'string.base': 'Seniority level must be a string.',
            'any.only':
                'Seniority level must be one of the following: ' + Object.values(enums.seniorityLevel).join(', ') + '.',
            'any.required': 'Seniority level is required.',
        }),

    jobDescription: Joi.string().trim().required().messages({
        'string.base': 'Job description must be a string.',
        'string.empty': 'Job description cannot be empty.',
        'any.required': 'Job description is required.',
    }),

    technicalSkills: Joi.array().items(Joi.string()).required().messages({
        'array.base': 'Technical skills must be an array.',
        'any.required': 'Technical skills are required.',
    }),

    softSkills: Joi.array().items(Joi.string()).required().messages({
        'array.base': 'Soft skills must be an array.',
        'any.required': 'Soft skills are required.',
    }),
});

const updateJob = Joi.object({
    jobId: generalFields.id.required().messages({
        'any.required': 'Job ID is required',
        'string.empty': 'Job ID cannot be an empty string',
        'string.base': 'Job ID must be a string',
        'string.custom': 'Job ID must be a type of ObjectId from MongoDB',
        custom: 'Job ID must be a type of ObjectId from MongoDB',
    }),

    authorization: generalFields.authorization.required().messages({
        'any.required': 'Authorization is required.',
    }),
    jobTitle: Joi.string().trim().messages({
        'string.base': 'Job title must be a string.',
        'string.empty': 'Job title cannot be empty.',
        'any.required': 'Job title is required.',
    }),

    jobLocation: Joi.string()
        .valid(...Object.values(enums.jobLocation))

        .messages({
            'string.base': 'Job location must be a string.',
            'any.only':
                'Job location must be one of the following: ' + Object.values(enums.jobLocation).join(', ') + '.',
            'any.required': 'Job location is required.',
        }),

    workingTime: Joi.string()
        .valid(...Object.values(enums.workingTime))

        .messages({
            'string.base': 'Working time must be a string.',
            'any.only':
                'Working time must be one of the following: ' + Object.values(enums.workingTime).join(', ') + '.',
            'any.required': 'Working time is required.',
        }),

    seniorityLevel: Joi.string()
        .valid(...Object.values(enums.seniorityLevel))

        .messages({
            'string.base': 'Seniority level must be a string.',
            'any.only':
                'Seniority level must be one of the following: ' + Object.values(enums.seniorityLevel).join(', ') + '.',
            'any.required': 'Seniority level is required.',
        }),

    jobDescription: Joi.string().trim().messages({
        'string.base': 'Job description must be a string.',
        'string.empty': 'Job description cannot be empty.',
        'any.required': 'Job description is required.',
    }),

    technicalSkills: Joi.array().items(Joi.string()).messages({
        'array.base': 'Technical skills must be an array.',
        'any.required': 'Technical skills are required.',
    }),

    softSkills: Joi.array().items(Joi.string()).messages({
        'array.base': 'Soft skills must be an array.',
        'any.required': 'Soft skills are required.',
    }),
}).or('jobTitle', 'jobLocation', 'workingTime', 'seniorityLevel', 'jobDescription', 'technicalSkills', 'softSkills');

const deleteJob = Joi.object({
    jobId: generalFields.id.required().messages({
        'any.required': 'Job ID is required',
        'string.empty': 'Job ID cannot be an empty string',
        'string.base': 'Job ID must be a string',
        'string.custom': 'Job ID must be a type of ObjectId from MongoDB',
        custom: 'Job ID must be a type of ObjectId from MongoDB',
    }),
});

const addJobApplication = Joi.object({
    jobId: generalFields.id.required().messages({
        'any.required': 'Job ID is required',
        'string.empty': 'Job ID cannot be an empty string',
        'string.base': 'Job ID must be a string',
        'string.custom': 'Job ID must be a type of ObjectId from MongoDB',
        custom: 'Job ID must be a type of ObjectId from MongoDB',
    }),
    attachments: generalFields.attachments.max(2).required().messages({
        'any.required': 'Attachments are required',
        'array.max': 'Attachments must be a maximum of 2 files',
    }),
    authorization: generalFields.authorization.required().messages({
        'any.required': 'Authorization is required.',
    }),
});

const acceptOrRejectApplicant = Joi.object({
    authorization: generalFields.authorization.required().messages({
        'any.required': 'Authorization is required.',
    }),
    applicationId: generalFields.id.required().messages({
        'any.required': 'Application ID is required',
        'string.empty': 'Application ID cannot be an empty string',
        'string.base': 'Application ID must be a string',
        'string.custom': 'Application ID must be a type of ObjectId from MongoDB',
        custom: 'Application ID must be a type of ObjectId from MongoDB',
    }),
    status: Joi.string().valid('accepted', 'rejected').required().messages({
        'string.base': 'Status must be a string.',
        'any.only': 'Status must be either "accepted" or "rejected".',
        'any.required': 'Status is required.',
    }),
});

export { addJob, updateJob, deleteJob, addJobApplication, acceptOrRejectApplicant };
