import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

// Define the User type using GraphQLObjectType
export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: GraphQLID }, // User identifier (ID)
        firstName: { type: GraphQLString }, // User's first name
        lastName: { type: GraphQLString }, // User's last name
        email: { type: GraphQLString }, // User's email address
        phoneNumber: { type: GraphQLString }, // User's phone number
        birthDate: { type: GraphQLString }, // User's birthdate
        gender: { type: GraphQLString }, // User's gender
        role: { type: GraphQLString }, // User's role (e.g., Admin, User)
        isConfirmed: { type: GraphQLBoolean }, // Whether the user's account is confirmed
        provider: { type: GraphQLString }, // The provider for authentication (e.g., Google, Facebook)
        profilePicture: {
            // User's profile picture object
            type: new GraphQLObjectType({
                name: 'ProfilePicture',
                fields: {
                    secure_url: { type: GraphQLString }, // Secure URL of the profile picture
                    public_id: { type: GraphQLString }, // Public ID of the profile picture
                },
            }),
        },
    }),
});

// Define the Company type using GraphQLObjectType
export const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        _id: { type: GraphQLID }, // Company identifier (ID)
        companyEmail: { type: GraphQLString }, // Company email address
        companyName: { type: GraphQLString }, // Name of the company
        companyAddress: { type: GraphQLString }, // Company address
        description: { type: GraphQLString }, // Company description
        industry: { type: GraphQLString }, // Industry type of the company
        numberOfEmployees: { type: GraphQLString }, // Number of employees in the company
        logo: {
            // Company's logo object
            type: new GraphQLObjectType({
                name: 'Logo',
                fields: {
                    secure_url: { type: GraphQLString }, // Secure URL of the company logo
                    public_id: { type: GraphQLString }, // Public ID of the company logo
                },
            }),
        },
        coverPic: {
            // Company's cover picture object
            type: new GraphQLObjectType({
                name: 'CoverPic',
                fields: {
                    secure_url: { type: GraphQLString }, // Secure URL of the company cover photo
                    public_id: { type: GraphQLString }, // Public ID of the company cover photo
                },
            }),
        },
        legalAttachments: {
            // List of legal attachments related to the company
            type: new GraphQLList(
                new GraphQLObjectType({
                    name: 'LegalAttachments',
                    fields: {
                        secure_url: { type: GraphQLString }, // Secure URL of the legal attachment
                        public_id: { type: GraphQLString }, // Public ID of the legal attachment
                    },
                })
            ),
        },
        createdBy: { type: UserType }, // User who created the company (Admin or HR)
        HRs: {
            // List of HRs associated with the company
            type: new GraphQLList(UserType),
        },
        approvedByAdmin: { type: GraphQLBoolean }, // Whether the company is approved by an admin
    }),
});

// Define the response type for fetching all data (users and companies)
export const allDataResponse = new GraphQLObjectType({
    name: 'allDataResponse',
    description: 'Returns a list of data objects for users and companies',
    fields: {
        users: { type: new GraphQLList(UserType) }, // List of users
        companies: { type: new GraphQLList(CompanyType) }, // List of companies
        success: { type: GraphQLBoolean }, // Success flag (true/false)
        message: { type: GraphQLString }, // A message providing additional information
    },
});
