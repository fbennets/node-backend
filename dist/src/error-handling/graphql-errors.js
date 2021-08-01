"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeNotFoundError = void 0;
const base_error_1 = require("./base-error");
const types_1 = require("./types");
class TreeNotFoundError extends base_error_1.BaseError {
    constructor({ name = "TreeNotFound", message = "The tree was not found.", additionalErrorData, statusCode = types_1.HTTPStatusCodes.BAD_REQUEST, isOperational, }) {
        super({
            name,
            message,
            additionalErrorData,
            statusCode,
            isOperational,
        });
    }
}
exports.TreeNotFoundError = TreeNotFoundError;
//# sourceMappingURL=graphql-errors.js.map