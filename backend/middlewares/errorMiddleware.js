// errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging

    const statusCode = res.statusCode ? res.statusCode : 500; // Default to 500 if status code is not set

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Hide stack in production
    });
};

module.exports = errorHandler;
