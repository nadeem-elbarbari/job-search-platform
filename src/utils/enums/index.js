const UserGender = {
    MALE: 'male',
    FEMALE: 'female',
    UNSPECIFIED: 'unspecified',
};

const ProviderType = {
    GOOGLE: 'google',
    SYSTEM: 'system',
};

const UserRoles = {
    ADMIN: 'admin',
    USER: 'user',
};

const OtpType = {
    CONFIRM_EMAIL: 'confirm email',
    FORGOT_PASSWORD: 'forgot password',
};

const jobLocation = {
    onsite: 'onsite',
    remotely: 'remotely',
    hybrid: 'hybrid',
};

const workingTime = {
    partTime: 'part-time',
    fullTime: 'full-time',
};

const seniorityLevel = {
    Fresh: 'fresh',
    Junior: 'Junior',
    MidLevel: 'Mid-Level',
    Senior: 'Senior',
    TeamLead: 'Team-Lead',
    CTO: 'CTO',
};

const numberOfEmployees = {
    '1-10': '1-10',
    '11-20': '11-20',
    '21-50': '21-50',
    '51-100': '51-100',
    '101-200': '101-200',
    '201-500': '201-500',
    '500+': '500+',
};

const appStatus = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    VIEWED: 'viewed',
    IN_CONSIDERATION: 'in consideration',
    REJECTED: 'rejected',
};

export {
    UserGender,
    UserRoles,
    ProviderType,
    OtpType,
    jobLocation,
    workingTime,
    seniorityLevel,
    numberOfEmployees,
    appStatus,
};
