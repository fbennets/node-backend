"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = void 0;
const generate_and_verifyToken_1 = require("./utils/generate-and-verifyToken");
const express_validator_1 = require("express-validator");
const api_errors_1 = require("./../error-handling/api-errors");
const access_token_blocklist_1 = require("./utils/access-token-blocklist");
const checkAuthorization = async function (req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
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
        userUuid = (0, generate_and_verifyToken_1.verifyAccessTokenAndGetUserUuid)(token);
        const tokenIsBlocked = await (0, access_token_blocklist_1.isAccessTokenBlocked)(token);
        if (!tokenIsBlocked) {
            // If everything is okay, continue
            res.context.userUuid = userUuid;
            return next();
        }
        else {
            return next(new api_errors_1.Api401Error({
                name: "InvalidAccessToken",
                message: "Invalid Access Token.",
            }));
        }
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
    (0, express_validator_1.header)("Authorization", "Did not find a valid JWT in Authorization header.").isJWT(),
    checkAuthorization,
];
//# sourceMappingURL=authentication-middleware.js.map