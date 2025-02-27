import mongoose from 'mongoose';
import { appStatus } from '../../utils/enums/index.js';

const ApplicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobOpportunity',
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        userCV: {
            secure_url: { type: String },
            public_id: { type: String },
        },

        status: {
            type: String,
            enum: Object.values(appStatus),
            default: appStatus.PENDING,
        },
    },

    { timestamps: true }
);

export const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
