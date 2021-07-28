"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_SECRET = "SUPER_INSECURE_SECRET";
const REFFRESH_TOKEN_SECRET = "EVEN_WORSE_INSECURE_SECRET";
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign({ userId: user.uuid }, ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
}
exports.generateAccessToken = generateAccessToken;
function generateRefreshToken(user) {
    return jsonwebtoken_1.default.sign({ userId: user.uuid }, REFFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
    });
}
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=generateToken.js.map