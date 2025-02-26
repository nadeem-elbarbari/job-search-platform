import jwt from 'jsonwebtoken';

export const generateToken = (payload, secret, exp) => {
    return jwt.sign(payload, secret, { expiresIn: exp });
};

export const verifyToken = ({ token, secret }) => {
    return jwt.verify(token, secret);
};

// Helper function to generate authentication tokens (access and refresh tokens)
export const generateAuthTokens = (user) => {
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
