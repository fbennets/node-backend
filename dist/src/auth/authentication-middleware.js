"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = void 0;
const generate_and_verifyToken_1 = require("./utils/generate-and-verifyToken");
const express_validator_1 = require("express-validator");
const api_errors_1 = require("./../error-handling/api-errors");
const checkAuthorization = function (req, res, next) {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(new api_errors_1.Api400Error({
            name: "InvalidInput",
            message: "Missing or incorrect Authorization header.",
            additionalErrorData: errors.array(),
        }));
    }
    const token = req.headers.authorization;
    let userUuid;
    try {
        userUuid = generate_and_verifyToken_1.verifyAccessTokenAndGetUserUuid(token);
        // If everything is okay, continue
        res.locals.user = userUuid;
        return next();
    }
    catch (err) {
        // Return error if any of the steps fails
        return next(new api_errors_1.Api401Error({
            name: err.name,
            message: err.message || "Invalid Access Token.",
        }));
    }
};
exports.isAuthorized = [
    express_validator_1.header("Authorization", "Did not find a valid JWT in Authorization header.").isJWT(),
    checkAuthorization,
];
//# sourceMappingURL=authentication-middleware.js.map