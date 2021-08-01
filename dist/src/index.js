"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const type_graphql_1 = require("type-graphql");
const auth_router_1 = require("./auth/auth-router");
const authentication_middleware_1 = require("./auth/authentication-middleware");
const error_handling_middleware_1 = require("./error-handling/error-handling-middleware");
const resolvers_1 = require("./graphql/resolvers");
const app = express_1.default();
const port = process.env.PORT || 4000;
const prisma = new client_1.PrismaClient();
app.locals.prisma = prisma;
app.use(cookie_parser_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors_1.default());
app.use(helmet_1.default());
let schema;
async function bootstrap() {
    schema = await type_graphql_1.buildSchema({
        resolvers: [resolvers_1.TreeResolver],
        emitSchemaFile: true,
    });
}
app.use("/auth", auth_router_1.authRouter);
app.use("/restricted", authentication_middleware_1.isAuthorized, async (req, res) => {
    res.send("Awesome");
});
app.use("/graphql", authentication_middleware_1.isAuthorized, express_graphql_1.graphqlHTTP(async (req, res, graphQLParams) => ({
    schema: schema,
    graphiql: true,
    context: (req, res) => {
        return {
            ...req,
            prisma,
            userUuid: res.locals.user,
        };
    },
})));
app.use(error_handling_middleware_1.logError);
app.use(error_handling_middleware_1.returnError);
app.listen({ port: port }, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
bootstrap();
//# sourceMappingURL=index.js.map