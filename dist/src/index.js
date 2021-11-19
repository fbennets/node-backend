"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.prisma = exports.app = void 0;
require("reflect-metadata");
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_graphql_1 = require("express-graphql");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const type_graphql_1 = require("type-graphql");
const auth_router_1 = require("./auth/auth-router");
const authentication_middleware_1 = require("./auth/authentication-middleware");
const error_handling_middleware_1 = require("./error-handling/error-handling-middleware");
const resolvers_1 = require("./graphql/resolvers");
const base_error_1 = require("./error-handling/base-error");
const access_token_blocklist_1 = require("./auth/utils/access-token-blocklist");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const port = process.env.PORT || 4000;
exports.prisma = new client_1.PrismaClient();
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cors_1.default)());
exports.app.use((0, helmet_1.default)());
let schema;
async function asyncPreparation() {
    schema = await (0, type_graphql_1.buildSchema)({
        resolvers: [resolvers_1.TreeResolver],
        emitSchemaFile: true,
    });
    try {
        await exports.prisma.$connect();
    }
    catch (e) {
        const err = new base_error_1.BaseError({
            name: "DatabaseConnectionFailed",
            message: "Could not connect to the database.",
        });
        (0, error_handling_middleware_1.logError)(err);
    }
    (0, access_token_blocklist_1.cleanBlocklist)();
}
exports.app.use("/auth", auth_router_1.authRouter);
exports.app.use("/restricted", authentication_middleware_1.isAuthorized, async (req, res) => {
    res.send("Awesome");
});
exports.app.use("/graphql", authentication_middleware_1.isAuthorized, (0, express_graphql_1.graphqlHTTP)(async (req, res, graphQLParams) => ({
    schema: schema,
    graphiql: true,
    context: (req, res) => {
        return {
            ...req,
            prisma: exports.prisma,
            userUuid: res.context.userUuid,
        };
    },
})));
// app.use(logError);
exports.app.use(error_handling_middleware_1.returnError);
exports.server = exports.app.listen({ port: port }, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
asyncPreparation();
//# sourceMappingURL=index.js.map