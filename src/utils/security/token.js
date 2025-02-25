import jwt from 'jsonwebtoken';

export const generateToken = (payload, secret, exp) => {
    return jwt.sign(payload, secret, { expiresIn: exp });
};

export const verifyToken = ({ token, secret }) => {
    return jwt.verify(token, secret);
};
