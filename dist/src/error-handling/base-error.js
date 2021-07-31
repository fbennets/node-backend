"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = void 0;
const types_1 = require("./types");
class BaseError extends Error {
    constructor({ name, message, additionalErrorData = {}, statusCode = types_1.HTTPStatusCodes.INTERNAL_SERVER, isOperational = true, }) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.additionalErrorData = additionalErrorData;
        Error.captureStackTrace(this);
    }
}
exports.BaseError = BaseError;
//# sourceMappingURL=base-error.js.map