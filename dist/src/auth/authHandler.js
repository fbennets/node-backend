"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("./generateToken");
async function signup(email, password, prisma) {
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password },
    });
    const accessToken = generateToken_1.generateAccessToken(user);
    const refreshToken = generateToken_1.generateRefreshToken(user);
    return {
        accessToken,
        refreshToken,
        user,
    };
}
exports.signup = signup;
async function login(email, password, prisma) {
    const user = await prisma.user.findUnique({
        where: { email: email },
    });
    if (!user) {
        throw new Error("No such user found");
    }
    const passwordIsvalid = await bcryptjs_1.default.compare(password, user.password);
    if (passwordIsvalid) {
        const accessToken = generateToken_1.generateAccessToken(user);
        const refreshToken = generateToken_1.generateRefreshToken(user);
        return {
            accessToken,
            refreshToken,
            user,
        };
    }
    else {
        throw new Error("Invalid password");
    }
}
exports.login = login;
async function refreshToken() { }
async function validateTokenAndGetUserId() { }
//# sourceMappingURL=authHandler.js.map