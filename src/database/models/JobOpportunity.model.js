import mongoose, { Schema, model } from 'mongoose';
import * as enums from '../../utils/enums/index.js';

const JobOpportunitySchema = new Schema(
    {
        jobTitle: { type: String, required: true, trim: true },

        jobLocation: { type: String, enum: Object.values(enums.jobLocation), required: true },

        workingTime: { type: String, enum: Object.values(enums.workingTime), required: true },

        seniorityLevel: { type: String, enum: Object.values(enums.seniorityLevel), required: true },

        jobDescription: { type: String, required: true, trim: true },

        technicalSkills: [{ type: String, required: true }],

        softSkills: [{ type: String, required: true }],

        addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },

        closed: { type: Boolean, default: false },

        companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

JobOpportunitySchema.virtual('applications', {
    ref: 'Application',
    localField: '_id',
    foreignField: 'jobId',
});

export const JobOpportunity = mongoose.models.JobOpportunity || model('JobOpportunity', JobOpportunitySchema);
