"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_functions_1 = require("./auth-functions");
const api_errors_1 = require("../error-handling/api-errors");
const isJWT_1 = __importDefault(require("validator/lib/isJWT"));
const isUUID_1 = __importDefault(require("validator/lib/isUUID"));
const authentication_middleware_1 = require("./authentication-middleware");
exports.authRouter = express_1.default.Router();
//Base routes
exports.authRouter.post("/signup", (0, express_validator_1.body)("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(), (0, express_validator_1.body)("password", "The password must be at least 8 characters and at most 100 characters long.").isLength({ min: 8, max: 100 }), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new api_errors_1.Api400Error({
            name: "InvalidInput",
            message: "Missing or incorrect input data.",
            additionalErrorData: errors.array(),
        }));
    }
    let signupResult;
    signupResult = await (0, auth_functions_1.signup)(req.body.email, req.body.password);
    if (signupResult instanceof Error) {
        return next(new api_errors_1.Api400Error({
            name: signupResult.name,
            message: signupResult.message,
        }));
    }
    const { accessToken, refreshToken, user } = signupResult;
    //Handle refresh token - set httpOnly cookie
    res.cookie("refreshCookie", refreshToken, {
        maxAge: 604800,
        secure: true,
        httpOnly: true,
        sameSite: "none",
    });
    //Set the return body
    res.json({
        accessToken: accessToken,
        user: user.email,
        status: "ok",
    });
});
exports.authRouter.post("/login", (0, express_validator_1.body)("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new api_errors_1.Api400Error({
            name: "InvalidInput",
            message: "Missing or incorrect input data.",
            additionalErrorData: errors.array(),
        }));
    }
    const loginResult = await (0, auth_functions_1.login)(req.body.email, req.body.password);
    if (loginResult instanceof Error) {
        return next(new api_errors_1.Api400Error({
            name: loginResult.name,
            message: loginResult.message,
        }));
    }
    const { accessToken, refreshToken, user } = loginResult;
    //Handle refresh token - set httpOnly cookie
    res.cookie("refreshCookie", refreshToken, {
        maxAge: 604800,
        secure: true,
        httpOnly: true,
        sameSite: "none",
    });
    //Set the return body
    res.json({ accessToken: accessToken, status: "ok" });
});
exports.authRouter.post("/logout", async (req, res, next) => {
    const accessToken = req.headers.authorization;
    const refreshToken = req.cookies.refreshCookie;
    const logoutData = {};
    if (accessToken && (0, isJWT_1.default)(accessToken)) {
        logoutData.accessToken = accessToken;
    }
    if (refreshToken && (0, isUUID_1.default)(refreshToken)) {
        logoutData.refreshToken = refreshToken;
    }
    //There is no real failing here. If the accessToken is still valid, it's blacklisted. If it's invalid, we don't do anything.
    //If the refreshToken is valid, it's being deleted from the database. If not, we don't do anything.
    await (0, auth_functions_1.logout)(logoutData);
    //TODO: send delete cookie command to client
    res.json({ status: "ok" });
});
exports.authRouter.post("/refresh", (0, express_validator_1.cookie)("refreshCookie", "Didn't find a valid refreshToken in the refreshCookie.").isUUID(4), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new api_errors_1.Api400Error({
            name: "InvalidRefreshToken",
            message: "Missing or incorrectly formatted refresh token.",
            additionalErrorData: errors.array(),
        }));
    }
    else {
        const refreshToken = req.cookies.refreshCookie;
        const refreshHandlerReturn = await (0, auth_functions_1.refreshAndStoreNewToken)(refreshToken);
        if (refreshHandlerReturn instanceof Error) {
            next(new api_errors_1.Api400Error({
                name: refreshHandlerReturn.name,
                message: refreshHandlerReturn.message,
            }));
        }
        else {
            const { newAccessToken, newRefreshToken, user } = refreshHandlerReturn;
            //Handle refresh token - set httpOnly cookie
            res.cookie("refreshCookie", newRefreshToken, {
                maxAge: 604800,
                secure: true,
                httpOnly: true,
                sameSite: "none",
            });
            //Set the return body
            res.json({
                accessToken: newAccessToken,
                status: "ok",
            });
        }
    }
});
//Methods which require the user to be signed in
exports.authRouter.get("/profile", authentication_middleware_1.isAuthorized, async (req, res, next) => { });
exports.authRouter.post("/settings/password", authentication_middleware_1.isAuthorized, (0, express_validator_1.body)("oldPassword", "The old password seems to be invalid.").isLength({
    min: 8,
    max: 100,
}), (0, express_validator_1.body)("newPassword", "The new password must be at least 8 characters and at most 100 characters long.").isLength({ min: 8, max: 100 }), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new api_errors_1.Api400Error({
            name: "InvalidPassword",
            message: "The old or new password is in an invalid format.",
            additionalErrorData: errors.array(),
        }));
    }
    else {
        //Even though the user is already signed-in, we want to request the password again
        //to prevent abuse by a third party using a logged-in account
        const result = (0, auth_functions_1.changePasswordWhenLoggedIn)(req.body.oldPassword, req.body.newPassword, res.context.userUuid);
    }
});
exports.authRouter.post("/settings/email", authentication_middleware_1.isAuthorized, (0, express_validator_1.body)("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new api_errors_1.Api400Error({
            name: "InvalidEmail",
            message: "Missing or incorrect email data.",
            additionalErrorData: errors.array(),
        }));
    }
    else {
        const result = await (0, auth_functions_1.updateEmail)(req.body.email, res.context.userUuid);
        if (result instanceof api_errors_1.Api400Error) {
            return next(result);
        }
        else {
            res.json({
                message: `E-Mail was changed to ${result}`,
                status: "ok",
            });
        }
    }
});
//Reset password routes
exports.authRouter.post("/request-password-reset/", (0, express_validator_1.body)("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new api_errors_1.Api400Error({
            name: "InvalidEmail",
            message: "Missing or incorrect e-mail address.",
            additionalErrorData: errors.array(),
        }));
    }
    else {
        (0, auth_functions_1.requestPasswordResetMail)(req.body.email);
        res.json({
            message: "If this account exists in our database, we will send you an e-mail to reset your password.",
            status: "ok",
        });
    }
});
exports.authRouter.post("/reset-password", (0, express_validator_1.body)("resetCode", "Invalid reset code.")
    .isString()
    .isLength({ min: 100, max: 100 }), (0, express_validator_1.body)("newPassword", "The password must be at least 8 characters and at most 100 characters long.")
    .isString()
    .isLength({ min: 8, max: 100 }), async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new api_errors_1.Api400Error({
            name: "InvalidInput",
            message: "Missing or incorrect input data.",
            additionalErrorData: errors.array(),
        }));
    }
    const resetCode = req.body.resetCode;
    const newPassword = req.body.newPassword;
    if (resetCode) {
        try {
            (0, auth_functions_1.resetPasswordWithCode)(newPassword, resetCode);
            res.json({
                message: "You're password has been reset. You can now log-in with your new password.",
                status: "ok",
            });
        }
        catch (err) {
            new api_errors_1.Api400Error({
                name: err.name,
                message: err.message,
            });
        }
    }
});
//# sourceMappingURL=auth-router.js.map