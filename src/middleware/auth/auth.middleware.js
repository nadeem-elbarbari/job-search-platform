import moment from 'moment';
import User from '../../database/models/User.model.js';
import { verifyToken } from '../../utils/security/token.js';
import { handleError } from '../error/errors.middleware.js';

// Enum for token types (access & refresh)
export const TokenTypes = {
    ACCESS: 'access',
    REFRESH: 'refresh',
};

// Helper function to get the corresponding token signature based on the bearer type
const getTokenSignature = (bearer) => {
    const signatures = {
        Bearer: {
            access: process.env.USER_ACCESS_TOKEN,
            refresh: process.env.USER_REFRESH_TOKEN,
        },
        Admin: {
            access: process.env.ADMIN_ACCESS_TOKEN,
            refresh: process.env.ADMIN_REFRESH_TOKEN,
        },
    };

    // Return the matching signatures or an empty object if the bearer is invalid
    return signatures[bearer] || {};
};

// Function to decode and verify the token
export const decodedToken = async ({ authorization, tokenType, next }) => {
    try {
        // Check if the authorization header exists
        if (!authorization) return handleError('Missing authorization header 🙅‍♂️', 400, next);

        // Extract the bearer type and token from the authorization header
        const [bearer, token] = authorization.split(' ');

        // Validate if both parts exist
        if (!bearer || !token) return handleError('Invalid token 🙅‍♂️', 400, next);

        // Retrieve the appropriate access and refresh token signatures
        const { access, refresh } = getTokenSignature(bearer);

        // Determine the correct secret key based on token type (access or refresh)
        const secret = tokenType === TokenTypes.ACCESS ? access : refresh;

        // If no valid secret is found, return an error
        if (!secret) return handleError('Invalid token 🙅‍♂️', 400, next);

        // Verify the token using the secret key
        const payload = verifyToken({ token, secret });

        // If the payload doesn't contain a user ID, return an error
        if (!payload?.id) return handleError('Invalid token 🙅‍♂️', 400, next);

        // Fetch the user from the database
        const user = await User.findById(payload.id);

        // Check if the user exists
        if (!user) return handleError('User not found 🙅‍♂️', 404, next);

        // Check if the user is banned
        if (user.bannedAt) return handleError('User is banned 🙅‍♂️', 400, next);

        // Check if the user is deleted
        if (user.deletedAt) return handleError('User not found 🙅‍♂️', 404, next);

        // Check if the user's credentials were changed after the token was issued
        if (user.changeCredentialTime && moment(user.changeCredentialTime).isAfter(moment.unix(payload.iat))) {
            return handleError('Login session expired 🙅‍♂️', 400, next);
        }

        return user; // Return the authenticated user object
    } catch (error) {
        next(error); // Pass any caught errors to the Express error handler
    }
};

// Middleware function to handle user authentication
export const authenticate = async (req, res, next) => {
    try {
        // Decode and verify the access token
        const user = await decodedToken({
            authorization: req.headers.authorization,
            tokenType: TokenTypes.ACCESS,
            next,
        });

        // Add the authenticated user to the request object
        req.user = user;

        next(); // Proceed to the next middleware
    } catch (error) {
        next(error); // Pass any caught errors to the Express error handler
    }
};

// Middleware function to handle user authorization based on roles
export const authorization = (accessRoles) => async (req, res, next) => {
    try {
        // Ensure the user exists and has a role that matches the allowed roles
        if (!req.user || !accessRoles.includes(req.user.role)) {
            return handleError('Access denied 🙅‍♂️', 403, next);
        }

        next(); // Proceed to the next middleware if authorized
    } catch (error) {
        next(error); // Pass any caught errors to the Express error handler
    }
};
