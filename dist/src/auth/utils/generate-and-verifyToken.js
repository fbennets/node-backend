"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueNewToken = exports.verifyAccessTokenAndGetUserUUIDAndExpiration = exports.verifyAccessTokenAndGetUserUuid = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const enc_base64_1 = __importDefault(require("crypto-js/enc-base64"));
const uuid_class_1 = require("../../types/uuid-class");
const base_error_1 = require("../../error-handling/base-error");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "SUPER_INSECURE_SECRET";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "EVEN_WORSE_SECRET";
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign({ userUuid: user.uuid }, ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
        algorithm: "HS256",
    });
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken() {
    return (0, uuid_1.v4)();
}
exports.generateRefreshToken = generateRefreshToken;
function verifyAccessTokenAndGetUserUuid(token) {
    //TODO: whath happens if this fails?
    const verifiedToken = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, {
        algorithms: ["HS256"],
    });
    const uuid = new uuid_class_1.UUID(verifiedToken.userUuid);
    if (uuid.isValid()) {
        return uuid;
    }
    else {
        //TODO:Switch to return, change in callers too
        throw new base_error_1.BaseError({
            name: "InvalidUUID",
            message: "Invalid UUID in access token.",
        });
    }
}
exports.verifyAccessTokenAndGetUserUuid = verifyAccessTokenAndGetUserUuid;
function verifyAccessTokenAndGetUserUUIDAndExpiration(token) {
    try {
        const verifiedToken = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, {
            algorithms: ["HS256"],
        });
        const uuid = new uuid_class_1.UUID(verifiedToken.userUuid);
        if (uuid.isValid()) {
            return {
                expiration: verifiedToken.exp,
                UUID: uuid,
            };
        }
        else {
            return Error("Invalid UUID.");
        }
    }
    catch (_a) {
        return Error("Token is invalid.");
    }
}
exports.verifyAccessTokenAndGetUserUUIDAndExpiration = verifyAccessTokenAndGetUserUUIDAndExpiration;
async function issueNewToken(refreshToken, prisma) {
    const hashedToken = enc_base64_1.default.stringify((0, sha256_1.default)(refreshToken));
    const user = await prisma.user.findFirst({
        where: { refreshToken: hashedToken },
    });
    if (user) {
        const now = Math.floor(Date.now() / 1000);
        if (now < user.loginExpiry) {
            if (now < user.refreshTokenExpiry) {
                // If the refresh token was issued less than 7 days ago and the last login was last than 30 days ago.
                return {
                    newAccessToken: generateAccessToken(user),
                    newRefreshToken: generateRefreshToken(),
                    user: user,
                };
            }
            else {
                // Login is still valid but refresh token expired.
                return new base_error_1.BaseError({
                    name: "RefreshTokenExpired",
                    message: "Refresh Token expired, please login again",
                });
            }
        }
        else {
            // Login has expired.
            return new base_error_1.BaseError({
                name: "LoginExpired",
                message: "Login expired, please login again",
            });
        }
    }
    else {
        // The refresh token is completely invalid and wasn't found in the database.
        return new base_error_1.BaseError({
            name: "InvalidRefreshToken",
            message: "The Refresh Token is invalid, please login again,",
        });
    }
}
exports.issueNewToken = issueNewToken;
//# sourceMappingURL=generate-and-verifyToken.js.map