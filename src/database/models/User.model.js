import mongoose, { Schema } from 'mongoose';
import * as enums from '../../utils/enums/index.js';
import moment from 'moment';
import { decrypt, encrypt } from '../../utils/security/encrypt.js';
import { Hash } from '../../utils/security/hash.js';

// Helper function to check if the provider is NOT Google
const isRequired = function () {
    return this.provider !== enums.ProviderType.GOOGLE;
};

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 3,
            maxlength: 10,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 3,
            maxlength: 10,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
        },

        phoneNumber: {
            type: String,
            required: isRequired,
            unique: true,
            trim: true,
            match: [/^(010|011|012|015)[0-9]{8}$/, 'Invalid Egyptian phoneNumber number'],
        },

        password: {
            type: String,
            required: isRequired,
            minlength: 8,
            maxlength: 20,
            match: [
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                'Password must include uppercase, lowercase, number, and special character',
            ],
        },

        gender: {
            type: String,
            enum: Object.values(enums.UserGender),
            default: enums.UserGender.UNSPECIFIED,
            lowercase: true,
        },

        birthDate: {
            type: Date,
            required: isRequired,
            validate: {
                validator: (value) => moment().diff(value, 'years') >= 18,
                message: 'User must be at least 18 years old.',
            },
        },

        profilePicture: {
            secure_url: String,
            public_id: String,
        },

        coverPicture: {
            secure_url: String,
            public_id: String,
        },

        role: {
            type: String,
            enum: Object.values(enums.UserRoles),
            default: enums.UserRoles.USER,
            lowercase: true,
        },

        provider: {
            type: String,
            enum: Object.values(enums.ProviderType),
            default: enums.ProviderType.SYSTEM,
        },

        isConfirmed: { type: Boolean },

        deletedAt: { type: Date },
        bannedAt: { type: Date },
        changeCredentialTime: { type: Date },

        OTP: [
            {
                code: { type: String },
                type: { type: String, enum: Object.values(enums.OtpType) },
                expiresIn: { type: Date },
            },
        ],
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Enable virtuals
userSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.userName = `${ret.firstName.toUpperCase()} ${ret.lastName.toUpperCase()}`;
        ret.userAge = moment().diff(ret.birthDate, 'years');
        delete ret.firstName;
        delete ret.lastName;
        delete ret.password;
        delete ret.__v;
        delete ret.id;
        return ret;
    },
});

userSchema.set('toObject', { virtuals: true });

// Virtual property for full name
userSchema.virtual('userName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// 🔒 Pre-save hook to encrypt before saving
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = Hash(this.password);
        this.changeCredentialTime = Date.now();
    }
    if (this.isModified('phoneNumber')) {
        this.phoneNumber = encrypt(this.phoneNumber);
    }
    next();
});

// 🔓 Post-findOne hook to decrypt for findOne queries
userSchema.post('findOne', function (doc) {
    if (doc && doc.phoneNumber) doc.phoneNumber = decrypt(doc.phoneNumber);
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
