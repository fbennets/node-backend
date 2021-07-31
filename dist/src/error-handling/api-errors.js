"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api401Error = exports.Api400Error = void 0;
const base_error_1 = require("./base-error");
const types_1 = require("./types");
class Api400Error extends base_error_1.BaseError {
    constructor({ name = "Bad Request", message = "Please check your inputs again.", additionalErrorData, statusCode = types_1.HTTPStatusCodes.BAD_REQUEST, isOperational, }) {
        super({
            name,
            message,
            additionalErrorData,
            statusCode,
            isOperational,
        });
    }
}
exports.Api400Error = Api400Error;
class Api401Error extends base_error_1.BaseError {
    constructor({ name = "Unauthorized", message = "You are not authorized.", additionalErrorData, statusCode = types_1.HTTPStatusCodes.UNAUTHORIZED, isOperational, }) {
        super({
            name,
            message,
            additionalErrorData,
            statusCode,
            isOperational,
        });
    }
}
exports.Api401Error = Api401Error;
// export class Api404Error extends BaseError {
//   constructor(
//     name: string,
//     statusCode = HTTPStatusCodes.NOT_FOUND,
//     description = "Not found.",
//     isOperational = true
//   ) {
//     super(name, statusCode, isOperational, description);
//   }
// }
//# sourceMappingURL=api-errors.js.map