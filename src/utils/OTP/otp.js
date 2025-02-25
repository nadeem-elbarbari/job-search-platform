import EventEmitter from 'events';
import * as db from '../../database/db.service.js';
import { OtpType } from '../enums/index.js';
import { customAlphabet } from 'nanoid';
import { Hash } from '../security/hash.js';
import { htmlTemplate } from './html.js';
import sendMail from '../nodemailer.js';
import User from '../../database/models/User.model.js';

// Generates a unique OTP of 6 digits using nanoid
const nanoid = customAlphabet('1234567890', 6);

// Create a new event emitter instance
export const EmailEvent = new EventEmitter();

// Function to handle OTP generation and email sending
const OtpEmail = async (data, type) => {
    // Generate a new OTP using nanoid
    const otp = nanoid();

    // Hash the generated OTP for secure storage
    const hashedOtp = Hash(otp);

    const { id, email, next } = data;

    try {
        // Attempt to update the OTP for the user in the database
        const updatedUser = await User.findOneAndUpdate(
            { _id: id, 'OTP.type': type },
            {
                $set: {
                    'OTP.$[elem].code': hashedOtp, // Set the hashed OTP
                    'OTP.$[elem].expiresIn': new Date(Date.now() + 10 * 60 * 1000), // Set expiration time for 10 minutes from now
                },
            },
            {
                // Ensure the array filter targets the correct OTP type
                arrayFilters: [{ 'elem.type': type }],
                new: true, // Return the updated user document
            }
        );

        // If no existing OTP entry was found, create a new OTP entry for the user
        if (!updatedUser) {
            await User.findByIdAndUpdate(id, {
                $push: {
                    OTP: {
                        code: hashedOtp,
                        type, // The type of OTP (confirm email or reset password)
                        expiresIn: new Date(Date.now() + 10 * 60 * 1000), // Set expiration time for 10 minutes
                    },
                },
            });
        }

        // Prepare the HTML content for the email using the OTP
        const html = htmlTemplate(otp);

        // Send the email with the OTP using the sendMail function
        sendMail(email, type === OtpType.CONFIRM_EMAIL ? 'Confirm your email' : 'Reset your password', html);
    } catch (error) {
        // Log an error if there was an issue updating the OTP
        console.log('Error updating OTP:', error);  
        next(error);
    }
};

// Register an event listener for 'confirmEmail' to trigger the OTP email function
EmailEvent.on('confirmEmail', (data) => OtpEmail(data, OtpType.CONFIRM_EMAIL));

// Register an event listener for 'forgotPassword' to trigger the OTP email function
EmailEvent.on('forgotPassword', (data) => OtpEmail(data, OtpType.FORGOT_PASSWORD));
