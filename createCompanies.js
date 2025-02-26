import mongoose from 'mongoose';
import { Company } from './src/database/models/Company.models.js'; // Adjust path as needed
import { faker } from '@faker-js/faker';
import * as enums from './src/utils/enums/index.js'; // Ensure this path is correct

// Connect to MongoDB (Replace with your actual MongoDB Atlas URI if needed)
mongoose.connect(
    'mongodb+srv://nadeemelbarbari:nuqbzpK96KqexdqE@cluster0.2gs4i.mongodb.net/linkedIn?retryWrites=true&w=majority&appName=Cluster0/',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

// Function to create random companies
const createRandomCompanies = async (count) => {
    const companies = [];

    for (let i = 0; i < count; i++) {
        const companyName = faker.company.name();
        const companyEmail = faker.internet.email(companyName.split(' ')[0]);
        const industry = faker.commerce.department();
        const companyAddress = faker.location.streetAddress();
        const numberOfEmployees = faker.helpers.arrayElement(Object.values(enums.numberOfEmployees));
        const description = faker.lorem.sentence();
        const createdBy = new mongoose.Types.ObjectId(); // Fake user ID
        const HRs = [new mongoose.Types.ObjectId()]; // Fake HR user IDs

        const logo = {
            secure_url: faker.image.avatar(),
            public_id: `logo_${faker.string.uuid()}`,
        };

        const coverPic = {
            secure_url: faker.image.urlLoremFlickr({ category: 'business' }),
            public_id: `cover_${faker.string.uuid()}`,
        };

        const legalAttachments = [
            {
                secure_url: faker.image.url(),
                public_id: `legal_${faker.string.uuid()}`,
            },
        ];

        // Check if company already exists
        const isExist = await Company.findOne({
            $or: [{ companyName }, { companyEmail }],
            deletedAt: { $exists: false },
            bannedAt: { $exists: false },
        });

        if (!isExist) {
            companies.push({
                companyName,
                companyEmail,
                industry,
                companyAddress,
                numberOfEmployees,
                description,
                createdBy,
                HRs,
                logo,
                coverPic,
                legalAttachments,
                approvedByAdmin: faker.datatype.boolean(),
            });
        }
    }

    if (companies.length > 0) {
        await Company.insertMany(companies);
        console.log(`✅ ${companies.length} companies created successfully!`);
    } else {
        console.log('⚠️ No new companies added (all duplicates).');
    }

    mongoose.connection.close();
};

// Get the count from command line arguments
const count = process.argv[2] || 10; // Default to 10 if not provided
createRandomCompanies(parseInt(count));
