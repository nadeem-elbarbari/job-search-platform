import { GraphQLError, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { CompanyType, allDataResponse } from './types.js';
import { Company } from '../../../database/models/Company.models.js';
import User from '../../../database/models/User.model.js';
import { decrypt } from '../../../utils/security/encrypt.js';
import { graphAuthMiddleware, TokenTypes } from './middleware.js';

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            allData: {
                type: allDataResponse, // Returns a list of user objects 📋👥
                args: {
                    token: { type: new GraphQLNonNull(GraphQLString) }, // Authorization token 🔑
                },
                resolve: async (_, { token }) => {
                    // Authenticate the user using the token 🔐
                    const user = await graphAuthMiddleware({ authorization: token, tokenType: TokenTypes.ACCESS });

                    // Check if the user is admin 🚨
                    if (user.role !== 'admin')
                        throw new GraphQLError('You are not authorized to perform this action 🚫');

                    // Fetch all companies with HRs and creator details 🏢👥
                    const companies = await Company.find().populate([
                        {
                            path: 'HRs', // HRs associated with the company 💼
                            select: 'name email role isConfirmed phoneNumber',
                        },
                        {
                            path: 'createdBy', // The user who created the company 👨‍💼
                            select: 'name email role isConfirmed phoneNumber',
                        },
                    ]);

                    // Fetch all users 👩‍💻👨‍💻
                    const users = await User.find();

                    // Return data with a success message ✅
                    return {
                        success: true, // Operation was successful ✅
                        message: 'Data found successfully 🏆', // Success message 🏅
                        users, // List of users 👥
                        companies, // List of companies 🏢
                    };
                },
            },
        },
    }),
});
