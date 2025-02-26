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
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true },
        },

        status: {
            type: String,
            enum: Object.values(appStatus),
            default: appStatus.PENDING,
        },
    },

    { timestamps: true }
);

export default mongoose.model('Application', ApplicationSchema);
