import { Chat } from '../../database/models/Chat.model.js';
import User from '../../database/models/User.model.js';
import { Company } from '../../database/models/Company.models.js';
import { io } from '../../../index.js';

// Get Chat History
export const getChatHistory = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const chat = await Chat.findOne({
            $or: [
                { senderId: currentUserId, recieverId: userId },
                { senderId: userId, recieverId: currentUserId },
            ],
        }).populate('messages.senderId', 'firstName lastName email');

        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        res.success(chat, 'Chat history fetched successfully');
    } catch (error) {
        next(error);
    }
};

// Send Message
export const sendMessage = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { content } = req.body;
        const senderId = req.user._id;

        if (senderId.toString() === userId.toString()) {
            return res.status(403).json({ message: 'You cannot start a chat with yourself' });
        }

        let chat = await Chat.findOne({
            $or: [
                { senderId, recieverId: userId },
                { senderId: userId, recieverId: senderId },
            ],
        });

        if (!chat) {
            const sender = await User.findById(senderId);
            if (!sender) {
                return res.status(404).json({ message: 'Sender not found' });
            }

            const isAuthorized = await Company.exists({
                $or: [{ HRs: senderId }, { createdBy: senderId }],
            });

            if (!isAuthorized) {
                return res.status(403).json({ message: 'Only HR or company owners can start a chat' });
            }

            chat = new Chat({ senderId, recieverId: userId, messages: [] });
        }

        chat.messages.push({ content, senderId });
        await chat.save();

        // Emit Socket event to notify the recipient
        io.to(userId.toString()).emit('chat:receiveMessage', {
            senderId,
            content,
            createdAt: new Date(),
        });

        res.status(201).json({ message: 'Message sent', chat });
    } catch (error) {
        next(error);
    }
};
