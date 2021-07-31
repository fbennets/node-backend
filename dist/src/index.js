"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = require("./auth/auth-router");
const authentication_middleware_1 = require("./auth/authentication-middleware");
const error_handling_middleware_1 = require("./error-handling/error-handling-middleware");
const app = express_1.default();
const port = process.env.PORT || 4000;
const prisma = new client_1.PrismaClient();
app.locals.prisma = prisma;
app.use(cookie_parser_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors_1.default());
app.use(helmet_1.default());
app.use("/auth", auth_router_1.authRouter);
app.use("/restricted", authentication_middleware_1.isAuthorized, async (req, res) => {
    res.send("Awesome");
});
// app.use(
//   "/graphql",
//   graphqlHTTP(async (request, response, graphQLParams) => ({
//     schema: schema,
//     graphiql: true,
//     context: (request: Request) => {
//       return {
//         ...request,
//         prisma,
//         userId:
//           request && request.headers.authorization ? getUserId(request) : null,
//       };
//     },
//   }))
// );
app.use(error_handling_middleware_1.logError);
app.use(error_handling_middleware_1.returnError);
app.listen({ port: port }, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map