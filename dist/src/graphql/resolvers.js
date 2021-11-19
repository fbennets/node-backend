"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeResolver = void 0;
const client_1 = require("@prisma/client");
const type_graphql_1 = require("type-graphql");
const tree_service_1 = require("./tree-service");
const graphql_errors_1 = require("./../error-handling/graphql-errors");
const uuid_class_1 = require("./../types/uuid-class");
const schema_1 = require("./schema");
const input_arguments_types_1 = require("./input-arguments-types");
let TreeResolver = class TreeResolver {
    constructor(treeService) {
        this.treeService = treeService;
    }
    async DecisionTree(id, userUuid, prisma) {
        const tree = await this.treeService.findById(id, userUuid, prisma);
        if (tree === undefined) {
            throw new graphql_errors_1.TreeNotFoundError({
                name: "TreeNotFound",
                message: `The tree with the ID ${id} was not found.`,
            });
        }
        return tree;
    }
    allTrees(userUuid, prisma) {
        return this.treeService.findAll(userUuid, prisma);
    }
    addTree(newTreeData, userUuid, prisma) {
        return this.treeService.addNew(newTreeData, userUuid, prisma);
    }
};
__decorate([
    (0, type_graphql_1.Query)((returns) => schema_1.DecisionTree),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Ctx)("userUuid")),
    __param(2, (0, type_graphql_1.Ctx)("prisma")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, uuid_class_1.UUID,
        client_1.PrismaClient]),
    __metadata("design:returntype", Promise)
], TreeResolver.prototype, "DecisionTree", null);
__decorate([
    (0, type_graphql_1.Query)((returns) => [schema_1.DecisionTree]),
    __param(0, (0, type_graphql_1.Ctx)("userUuid")),
    __param(1, (0, type_graphql_1.Ctx)("prisma")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_class_1.UUID,
        client_1.PrismaClient]),
    __metadata("design:returntype", void 0)
], TreeResolver.prototype, "allTrees", null);
__decorate([
    (0, type_graphql_1.Mutation)((returns) => schema_1.DecisionTree),
    __param(0, (0, type_graphql_1.Arg)("newTreeData")),
    __param(1, (0, type_graphql_1.Ctx)("userUuid")),
    __param(2, (0, type_graphql_1.Ctx)("prisma")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [input_arguments_types_1.NewTreeInput,
        uuid_class_1.UUID,
        client_1.PrismaClient]),
    __metadata("design:returntype", void 0)
], TreeResolver.prototype, "addTree", null);
TreeResolver = __decorate([
    (0, type_graphql_1.Resolver)(schema_1.DecisionTree),
    __metadata("design:paramtypes", [tree_service_1.TreeService])
], TreeResolver);
exports.TreeResolver = TreeResolver;
//   @Mutation((returns) => Boolean)
//   @Authorized(Roles.Admin)
//   async removeRecipe(@Arg("id") id: string) {
//     try {
//       await this.recipeService.removeById(id);
//       return true;
//     } catch {
//       return false;
//     }
//   }
// }
// owner: User;
// type User {
//   id: ID!
//   name: String!
//   email: String!
//   DecisionTrees: [DecisionTree!]!
// }
//# sourceMappingURL=resolvers.js.map