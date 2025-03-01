// Importing necessary modules
import { Router } from 'express'; // Express router
import * as service from './chats.service.js'; // Chat service functions
import * as validators from './chats.validators.js'; // Validation functions for chats
import { authenticate } from '../../middleware/auth/auth.middleware.js'; // Auth middleware
import { asyncHandler } from '../../middleware/error/errors.middleware.js'; // Error handling middleware
import { validation } from '../../middleware/validation/validate.middleware.js'; // Data validation middleware

// Initialize the router
const router = Router();

// Helper function to create chat routes
const createPath = (path) => `/chats/${path}`;

// Route to get chat history for a user
router.get(
    createPath(':userId'), // Path: /chats/:userId
    authenticate, // Check if the user is authenticated
    validation(validators.getChatHistory), // Validate the request data
    asyncHandler(service.getChatHistory) // Handle the request to get chat history
);

// Route to send a message to a user
router.post(
    createPath('send/:userId'), // Path: /chats/send/:userId
    authenticate, // Check if the user is authenticated
    validation(validators.sendMessage), // Validate the request data
    asyncHandler(service.sendMessage) // Handle the request to send a message
);

// Export the router to use in the main app
export default router;
