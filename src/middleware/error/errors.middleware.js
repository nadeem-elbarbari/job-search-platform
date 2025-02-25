export const errorMiddleWare = (err, req, res, next) => {
    res.status(+err.cause || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV == 'development' ? err.stack : undefined,
    });
};

export const handleError = (msg, cause, next) => next(new Error(msg, { cause }));
