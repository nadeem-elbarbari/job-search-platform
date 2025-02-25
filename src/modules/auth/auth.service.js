import moment from 'moment';
import * as db from '../../database/db.service.js';
import User from '../../database/models/User.model.js';
import { handleError } from '../../middleware/error/errors.middleware.js';
import { OtpType } from '../../utils/enums/index.js';
import { EmailEvent } from '../../utils/OTP/otp.js';
import { Compare, Hash } from '../../utils/security/hash.js';
import { generateToken, verifyToken } from '../../utils/security/token.js';
import { OAuth2Client } from 'google-auth-library';
import { decodedToken, TokenTypes } from '../../middleware/auth/auth.middleware.js';

// Helper function to generate authentication tokens (access and refresh tokens)
const generateAuthTokens = (user) => {
    // Generate a refresh token (used for long-term authentication)
    const refreshToken = generateToken(
        { id: user._id },
        user.role === 'admin' ? process.env.ADMIN_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,
        process.env.REFRESH_JWT_EXP
    );
    // Generate an access token (used for short-term authentication)
    const accessToken = generateToken(
        { id: user._id },
        user.role === 'admin' ? process.env.ADMIN_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN,
        process.env.ACCESS_JWT_EXP
    );
    return { accessToken, refreshToken };
};

// Register a new user
export const register = async (req, res, next) => {
    const userData = req.body;
    try {
        // Check if email already exists
        if (await db.findOne(User, { email: userData.email })) return handleError('Email already exist 🙅‍♂️', 409, next);

        // Create a new user record in the database
        const user = await db.create(User, userData);

        // Send email confirmation event
        EmailEvent.emit('confirmEmail', { id: user._id, email: user.email, next });

        // Respond with a success message
        return res.success(undefined, 'Confirmation email sent ✅', 201);
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Confirm the email address
export const emailConfirmation = async (req, res, next) => {
    try {
        const { email, code } = req.body;

        // Find the user by email
        const user = await db.findOne(User, { email });

        // Handle case when user is not found
        if (!user) return handleError('User not found 🙅‍♂️', 404, next);

        // Check if the email is already confirmed
        if (user.isConfirmed) return handleError('Email already confirmed ⚠️', 400, next);

        // Find the OTP for email confirmation
        const otp = user.OTP.find((otp) => otp.type === OtpType.CONFIRM_EMAIL);
        if (!otp) return handleError('No email confirmation OTP found 🙅‍♂️', 400, next);

        // Compare the provided OTP code with the stored code
        if (!Compare(code, otp.code)) return handleError('OTP is not matched 🙅‍♂️', 409, next);

        // Check if the OTP has expired
        if (moment().isAfter(moment(otp.expiresIn))) return handleError('OTP has expired ⏳', 400, next);

        // Update the user's status to confirmed
        await db.updateOne(User, { email }, { $set: { isConfirmed: true } });

        // Respond with a success message
        return res.success(undefined, 'Email confirmed ✅');
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Log in user
export const logIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await db.findOne(User, { email });

        // Handle case when user is not found
        if (!user) return handleError('User not found 🙅‍♂️', 404, next);

        // Check if the user is confirmed
        if (!user.isConfirmed) return handleError('User is not confirmed 🙅‍♂️', 400, next);

        // Compare the provided password with the stored password
        if (!Compare(password, user.password)) return handleError('Password is not matched 🙅‍♂️', 400, next);

        // Generate JWT tokens for successful login
        const tokens = generateAuthTokens(user);

        // Respond with the generated tokens
        return res.success(tokens, 'Login successful ✅');
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Google authentication
export const googleAuth = async (req, res, next) => {
    try {
        const { token } = req.body;

        // Initialize the OAuth2 client with Google client ID
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        // Function to verify the Google ID token
        const verify = async () => {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            return ticket.getPayload();
        };

        // Extract user data from the Google token
        const { email, email_verified, given_name, family_name, picture } = await verify();

        // Check if the user already exists in the database
        const user = await db.findOne(User, { email });

        // Handle case when the user is not registered with Google
        if (user && user.provider !== 'google') return handleError('Email is not registered with Google 🙅‍♂️', 400, next);

        // Handle case when the Google account is not verified
        if (!email_verified) return handleError('Your google account is not verified 🙅‍♂️', 401, next);

        // If user does not exist, create a new account
        if (!user) {
            await db.create(User, {
                firstName: given_name,
                lastName: family_name,
                email,
                provider: 'google',
                profilePicture: { secure_url: picture, public_id: undefined },
                isConfirmed: email_verified,
            });
            return res.success(undefined, 'Account created successful ✅');
        }

        // Generate JWT tokens for successful login
        const tokens = generateAuthTokens(user);

        // Respond with the generated tokens
        return res.success(tokens, 'Login successful ✅');
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Request OTP for forgot password
export const getForgotPasswordOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await db.findOne(User, { email });

        // Handle case when user is not found
        if (!user) return handleError('User not found 🙅‍♂️', 404, next);

        // Send OTP for password reset
        EmailEvent.emit('forgotPassword', { id: user._id, email: user.email, next });

        // Respond with a success message
        return res.success(undefined, 'OTP sent to your email ✅');
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

// Reset the user's password
export const resetPassword = async (req, res, next) => {
    try {
        const { code, email, newPassword } = req.body;

        // Find the user by email
        const user = await db.findOne(User, { email });

        // Handle case when user is not found
        if (!user) return handleError('User not found 🙅‍♂️', 404, next);

        // Find the OTP for password reset
        const otp = user.OTP.find((otp) => otp.type === OtpType.FORGOT_PASSWORD);
        if (!otp) return handleError('No password reset OTP found 🙅‍♂️', 400, next);

        // Compare the provided OTP code with the stored code
        if (!Compare(code, otp.code)) return handleError('OTP is not matched 🙅‍♂️', 409, next);

        // Check if the OTP has expired
        if (moment().isAfter(moment(otp.expiresIn))) return handleError('OTP has expired ⏳', 400, next);

        // Update the user's password
        user.password = newPassword;
        user.changeCredentialTime = Date.now();
        // Save the updated user
        await user.save({ validateBeforeSave: false });

        // Respond with a success message
        return res.success(undefined, 'Password reset successful ✅');
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        // Find the user by token
        const user = await decodedToken({ authorization, tokenType: TokenTypes.REFRESH, next });

        if (!user) return; // Prevent further execution if `decodedToken` failed

        // Generate new access token
        const accessToken = generateToken(
            { id: user._id },
            user.role === 'admin' ? process.env.ADMIN_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN,
            process.env.ACCESS_JWT_EXP
        );

        // Respond with the generated token
        return res.json({ accessToken, message: 'Token refreshed successfully ✅' });
    } catch (error) {
        next(error);
    }
};
