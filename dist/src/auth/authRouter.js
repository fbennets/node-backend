"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const authHandler_1 = require("./authHandler");
exports.authRouter = express_1.default.Router();
exports.authRouter.use(express_1.default.json());
exports.authRouter.post("/login", async (req, res) => {
    try {
        const { accessToken, refreshToken, user } = await authHandler_1.login(req.body.email, req.body.password, req.app.locals.prisma);
        res.json({ accessToken: accessToken, user: user.email });
        res.cookie("refreshCookie", refreshToken, {
            maxAge: 86400,
            secure: true,
            httpOnly: true,
            sameSite: "none",
        });
        return res;
    }
    catch (e) {
        return res;
    }
});
//# sourceMappingURL=authRouter.js.map