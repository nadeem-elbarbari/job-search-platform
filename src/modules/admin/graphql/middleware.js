import { GraphQLError } from 'graphql';

import { verifyToken } from '../../../utils/security/token.js';
import moment from 'moment'; // Assuming moment is already installed
import User from '../../../database/models/User.model.js';

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

export const graphAuthMiddleware = async ({ authorization, tokenType }) => {
    try {
        // Check if the authorization header exists
        if (!authorization) {
            throw new GraphQLError('Missing authorization header 🙅‍♂️', {
                extensions: { code: 'BAD_USER_INPUT', statusCode: 400 },
            });
        }

        // Extract the bearer type and token from the authorization header
        const [bearer, token] = authorization.split(' ');

        // Validate if both parts exist
        if (!bearer || !token) {
            throw new GraphQLError('Invalid token 🙅‍♂️', {
                extensions: { code: 'BAD_USER_INPUT', statusCode: 400 },
            });
        }

        // Retrieve the appropriate access and refresh token signatures
        const { access, refresh } = getTokenSignature(bearer);

        // Determine the correct secret key based on token type (access or refresh)
        const secret = tokenType === TokenTypes.ACCESS ? access : refresh;

        // If no valid secret is found, return an error
        if (!secret) {
            throw new GraphQLError('Invalid token 🙅‍♂️', {
                extensions: { code: 'BAD_USER_INPUT', statusCode: 400 },
            });
        }

        // Verify the token using the secret key
        const payload = verifyToken({ token, secret });

        // If the payload doesn't contain a user ID, return an error
        if (!payload?.id) {
            throw new GraphQLError('Invalid token 🙅‍♂️', {
                extensions: { code: 'BAD_USER_INPUT', statusCode: 400 },
            });
        }

        // Fetch the user from the database
        const user = await User.findById(payload.id);

        // Check if the user exists
        if (!user) {
            throw new GraphQLError('User not found 🙅‍♂️', {
                extensions: { code: 'NOT_FOUND', statusCode: 404 },
            });
        }

        // Check if the user is banned
        if (user.bannedAt) {
            throw new GraphQLError('User is banned 🙅‍♂️', {
                extensions: { code: 'FORBIDDEN', statusCode: 400 },
            });
        }

        // Check if the user is deleted
        if (user.deletedAt) {
            throw new GraphQLError('User not found 🙅‍♂️', {
                extensions: { code: 'NOT_FOUND', statusCode: 404 },
            });
        }

        // Check if the user's credentials were changed after the token was issued
        if (user.changeCredentialTime && moment(user.changeCredentialTime).isAfter(moment.unix(payload.iat))) {
            throw new GraphQLError('Login session expired 🙅‍♂️', {
                extensions: { code: 'UNAUTHORIZED', statusCode: 400 },
            });
        }

        return user; // Return the authenticated user object
    } catch (error) {
        // If any error occurs, propagate it as a GraphQL error
        throw new GraphQLError(error.message || 'An unknown error occurred', {
            extensions: { code: 'INTERNAL_SERVER_ERROR', statusCode: 500 },
        });
    }
};
