import mongoose from 'mongoose';
import User from './User.model.js';
import { Company } from './Company.models.js';

const MessageSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const ChatSchema = new mongoose.Schema(
    {
        messages: [MessageSchema],
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            validate: {
                validator: async function (value) {
                    // Validate sender is HR or company owner
                    const sender = await User.findById(value);
                    const company = await Company.find({
                        $or: [{ HRs: sender._id }, { createdBy: sender._id }],
                    });
                    if (sender && company.length > 0) {
                        return true;
                    }
                    return false;
                },
                message: 'Sender must be a company owner or HR',
            },
        },
        recieverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export const Message = mongoose.model('Message', MessageSchema);
export const Chat = mongoose.model('Chat', ChatSchema);
