"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_handler_1 = require("./auth-handler");
const api_errors_1 = require("../error-handling/api-errors");
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/signup", express_validator_1.body("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(), express_validator_1.body("password", "The password must be at least 8 characters long.").isLength({ min: 8 }), async (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(new api_errors_1.Api400Error({
            name: "InvalidInput",
            message: "Missing or incorrect input data.",
            additionalErrorData: errors.array(),
        }));
    }
    let signupResult;
    signupResult = await auth_handler_1.signup(req.body.email, req.body.password, req.app.locals.prisma);
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
exports.authRouter.post("/login", express_validator_1.body("email", "Invalid E-Mail address.").isEmail().normalizeEmail().trim(), async (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(new api_errors_1.Api400Error({
            name: "InvalidInput",
            message: "Missing or incorrect input data.",
            additionalErrorData: errors.array(),
        }));
    }
    const loginResult = await auth_handler_1.login(req.body.email, req.body.password, req.app.locals.prisma);
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
exports.authRouter.post("/refresh", express_validator_1.cookie("refreshCookie", "Didn't find a valid refreshToken in the refreshCookie.").isUUID(4), async (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(new api_errors_1.Api400Error({
            name: "InvalidRefreshToken",
            message: "Missing or incorrectly formatted refresh token.",
            additionalErrorData: errors.array(),
        }));
    }
    else {
        const refreshToken = req.cookies.refreshCookie;
        const refreshHandlerReturn = await auth_handler_1.refreshAndStoreNewToken(refreshToken, req.app.locals.prisma);
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
//# sourceMappingURL=auth-router.js.map