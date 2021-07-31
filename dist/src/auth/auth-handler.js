"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAndStoreNewToken = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const enc_base64_1 = __importDefault(require("crypto-js/enc-base64"));
const api_errors_1 = require("../error-handling/api-errors");
const base_error_1 = require("../error-handling/base-error");
const generate_and_verifyToken_1 = require("./utils/generate-and-verifyToken");
const generate_and_verifyToken_2 = require("./utils/generate-and-verifyToken");
async function signup(email, password, prisma) {
    //Has password and create user
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    let user;
    try {
        user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });
    }
    catch (err) {
        return new api_errors_1.Api400Error({
            name: "EmailAlreadyUsed",
            message: "The e-mail adress is already being used. Please choose another e-mail address.",
        });
    }
    const accessToken = generate_and_verifyToken_2.generateAccessToken(user);
    const refreshToken = generate_and_verifyToken_2.generateRefreshToken();
    //store the refresh token in the database - this for now restricts the no. of refresh token to one
    await prisma.user.update({
        where: { uuid: user.uuid },
        data: {
            refreshToken: enc_base64_1.default.stringify(sha256_1.default(refreshToken)),
            //One refresh token is valid for 7 days, but within 30 days (loginExpiry) a new refresh token will be issued if the user has a valid refresh token
            refreshTokenExpiry: Math.floor(Date.now() / 1000) + 604800,
            loginExpiry: Math.floor(Date.now() / 1000) + 2592000,
        },
    });
    return {
        accessToken,
        refreshToken,
        user,
    };
}
exports.signup = signup;
async function login(email, password, prisma) {
    // Find user in database
    const user = await prisma.user.findUnique({
        where: { email: email },
    });
    if (!user) {
        return new base_error_1.BaseError({
            name: "InvalidCredentials",
            message: "The user does not exist or the password and e-mail do not match.",
        });
    }
    const passwordIsvalid = await bcryptjs_1.default.compare(password, user.password);
    if (passwordIsvalid) {
        const accessToken = generate_and_verifyToken_2.generateAccessToken(user);
        const refreshToken = generate_and_verifyToken_2.generateRefreshToken();
        //store the refresh token in the database - this for now restricts the no. of refresh token to one
        await prisma.user.update({
            where: { uuid: user.uuid },
            data: {
                refreshToken: enc_base64_1.default.stringify(sha256_1.default(refreshToken)),
                //One refresh token is valid for 7 days, but within 30 days (loginExpiry) a new refresh token will be issued if the user has a valid refresh token
                refreshTokenExpiry: Math.floor(Date.now() / 1000) + 604800,
                loginExpiry: Math.floor(Date.now() / 1000) + 2592000,
            },
        });
        return {
            accessToken,
            refreshToken,
            user,
        };
    }
    else {
        return new base_error_1.BaseError({
            name: "InvalidCredentials",
            message: "The user does not exist or the password and e-mail do not match.",
        });
    }
}
exports.login = login;
async function refreshAndStoreNewToken(refreshToken, prisma) {
    const refreshReturn = await generate_and_verifyToken_1.issueNewToken(refreshToken, prisma);
    if (refreshReturn instanceof Error) {
        return new base_error_1.BaseError({
            name: refreshReturn.name,
            message: refreshReturn.message,
        });
    }
    const { newAccessToken, newRefreshToken, user } = refreshReturn;
    // Update token but keep expiry date
    await prisma.user.update({
        where: { uuid: user.uuid },
        data: {
            refreshToken: enc_base64_1.default.stringify(sha256_1.default(refreshToken)),
            // We don't update the loginExpiry, the user MUST login every 30 days
            refreshTokenExpiry: Math.floor(Date.now() / 1000) + 604800,
        },
    });
    return { newAccessToken, newRefreshToken, user };
}
exports.refreshAndStoreNewToken = refreshAndStoreNewToken;
//# sourceMappingURL=auth-handler.js.map