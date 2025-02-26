import { Schema, model, models } from 'mongoose';
import * as enums from '../../utils/enums/index.js';

const MediaSchema = new Schema(
    {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
    },
    { _id: false }
);

const CompanySchema = new Schema(
    {
        companyName: { type: String, unique: true, required: true, trim: true },

        description: { type: String, required: true, trim: true },

        industry: { type: String, required: true, trim: true },

        address: { type: String, required: true, trim: true },

        numberOfEmployees: {
            type: String,
            enum: Object.values(enums.numberOfEmployees),
            required: true,
        },

        companyEmail: { type: String, unique: true, required: true, lowercase: true, trim: true },

        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

        logo: MediaSchema,

        coverPic: MediaSchema,

        HRs: [{ type: Schema.Types.ObjectId, ref: 'User' }],

        bannedAt: { type: Date, default: null },

        deletedAt: { type: Date, default: null },

        legalAttachment: MediaSchema,

        approvedByAdmin: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Company = models.Company || model('Company', CompanySchema);
