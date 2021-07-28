"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const authRouter_1 = require("./auth/authRouter");
const app = express_1.default();
const port = process.env.PORT || 4000;
const prisma = new client_1.PrismaClient();
app.locals.prisma = prisma;
app.use(helmet_1.default());
app.use("/auth", authRouter_1.authRouter);
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
app.listen({ port: port }, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map