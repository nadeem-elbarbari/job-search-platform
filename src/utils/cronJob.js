import cron from 'node-cron';
import moment from 'moment';
import User from '../database/models/User.model.js';
import { updateMany } from '../database/db.service.js';

cron.schedule('0 */6 * * *', async () => {
    try {
        // Find users with OTPs that are expired
        const currentDate = moment().toDate();
        const result = await updateMany(
            User,
            { 'OTP.expiresIn': { $lt: currentDate } },
            { $pull: { OTP: { expiresIn: { $lt: currentDate } } } }
        );

        console.log(`Expired OTPs removed from ${result.modifiedCount} users.`);
    } catch (error) {
        console.error('Error removing expired OTPs:', error);
    }
});
