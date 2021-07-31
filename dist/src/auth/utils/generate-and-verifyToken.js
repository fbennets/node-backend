"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueNewToken = exports.verifyAccessTokenAndGetUserUuid = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const enc_base64_1 = __importDefault(require("crypto-js/enc-base64"));
const isUUID_1 = __importDefault(require("validator/lib/isUUID"));
const base_error_1 = require("../../error-handling/base-error");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "SUPER_INSECURE_SECRET";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "EVEN_WORSE_SECRET";
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign({ userUuid: user.uuid }, ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
    });
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken() {
    return uuid_1.v4();
}
exports.generateRefreshToken = generateRefreshToken;
function verifyAccessTokenAndGetUserUuid(token) {
    const verifiedToken = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
    const uuid = verifiedToken.userUuid;
    if (isUUID_1.default(uuid)) {
        return uuid;
    }
    else {
        // Switch to return
        throw new base_error_1.BaseError({
            name: "InvalidUUID",
            message: "Invalid UUID in access token.",
        });
    }
}
exports.verifyAccessTokenAndGetUserUuid = verifyAccessTokenAndGetUserUuid;
async function issueNewToken(refreshToken, prisma) {
    const hashedToken = enc_base64_1.default.stringify(sha256_1.default(refreshToken));
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
// export async function validateRefreshTokenAndGetUserId(
//   token: string,
//   prisma: PrismaClient
// ) {
//   const verifiedToken = jwt.verify(token, REFRESH_TOKEN_SECRET);
//   const userUuid = (verifiedToken as TokenInterface).userUuid;
//   //TODO: sanitize Uuid
//   const user = await prisma.user.findFirst({
//     where: { uuid: userUuid },
//   });
//   if (user) {
//     return user.id;
//   } else {
//     //Proper error handling
//     return "Wrong user";
//   }
// }
//verify token and get uuid
//Map uuid to userId
//# sourceMappingURL=generate-and-verifyToken.js.map