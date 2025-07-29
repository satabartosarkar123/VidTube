import mongoose from "mongoose";
import {ApiError} from   "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    // Handle Mongoose ValidationError
    if (error.name === "ValidationError") {
        const errors = {};
        for (const field in error.errors) {
            errors[field] = error.errors[field].message;
        }
        error = new ApiError(
            400,
            "Validation failed",
            errors,
            error.stack
        );
    } else if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, error, error ? error.stack : undefined);
    }

    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    }
    return res.status(error.statusCode).json(response);
}
export { errorHandler };