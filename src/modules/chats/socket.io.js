import { io } from '../../../index.js';
import { Chat } from '../../database/models/Chat.model.js';
import { decodedToken, TokenTypes } from '../../middleware/auth/auth.middleware.js';

// Socket.IO Connection
export const socket = () =>
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Authenticate user and join their room
        socket.on('authenticate', async (token) => {
            const user = await decodedToken({ authorization: token, tokenType: TokenTypes.ACCESS });
            if (!user) return socket.disconnect();

            socket.join(user._id.toString());
            console.log(`User ${user._id} joined their room`);
        });

        // Send Message Event
        socket.on('chat:sendMessage', async ({ senderId, recieverId, content }) => {
            const sender = await User.findById(senderId);
            const isAuthorized = await Company.exists({
                $or: [{ HRs: senderId }, { createdBy: senderId }],
            });

            if (!sender || (!isAuthorized && senderId !== recieverId)) return;

            let chat = await Chat.findOne({
                $or: [
                    { senderId, recieverId },
                    { senderId: recieverId, recieverId: senderId },
                ],
            });

            if (!chat) {
                chat = new Chat({ senderId, recieverId, messages: [] });
            }

            chat.messages.push({ content, senderId });
            await chat.save();

            // Emit to recipient
            io.to(recieverId.toString()).emit('chat:receiveMessage', {
                senderId,
                content,
                createdAt: new Date(),
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
