"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnError = exports.logErrorMiddleware = exports.logError = void 0;
const base_error_1 = require("./base-error");
//FIXME: currently only using baseError, (how) are ApiErrors handled?
function logError(err) {
    console.error(err.name);
    console.error(err.message);
}
exports.logError = logError;
function logErrorMiddleware(err, req, res, next) {
    logError(err);
    next(err);
}
exports.logErrorMiddleware = logErrorMiddleware;
function returnError(err, req, res, next) {
    if (Object.keys(err.additionalErrorData).length === 0) {
        res.status(err.statusCode || 500).json({
            errorType: err.name,
            errorDescription: err.message,
        });
    }
    else {
        res.status(err.statusCode || 500).json({
            errorType: err.name,
            description: err.message,
            errors: err.additionalErrorData,
        });
    }
}
exports.returnError = returnError;
function isOperationalError(error) {
    if (error instanceof base_error_1.BaseError) {
        return error.isOperational;
    }
    return false;
}
//# sourceMappingURL=error-handling-middleware.js.map