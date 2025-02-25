import bcrypt from 'bcrypt';

export const Hash = (data) => {
    return bcrypt.hashSync(data, +process.env.SALT_ROUNDS);
};

export const Compare = (data, hash) => {
    return bcrypt.compareSync(String(data), hash);
};
