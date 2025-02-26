// Error Middleware
export const errorMiddleware = (err, req, res, next) => {
    const statusCode = +err.cause || 500;
    const message = err.message || 'Internal Server Error';
    const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

    res.status(statusCode).json({
        success: false,
        message,
        stack,
    });
};

// handleError function
export const handleError = (msg, cause, next) => {
    const error = new Error(msg);
    error.cause = cause;
    return next(error);
};

// asyncHandler function
export const asyncHandler = (fn) => {
    if (typeof fn !== 'function') {
        throw new TypeError('Provided argument must be a function');
    }

    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};
