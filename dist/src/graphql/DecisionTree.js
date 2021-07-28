"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeMutation = exports.TreeQuery = exports.DecisionTree = void 0;
const nexus_1 = require("nexus");
const User_1 = require("./User");
exports.DecisionTree = nexus_1.objectType({
    name: "DecisionTree",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.nonNull.string("tags");
        t.nonNull.string("extraData");
        t.string("language");
        t.field("owner", { type: User_1.User });
    },
});
exports.TreeQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.field("trees", {
            type: "DecisionTree",
            resolve() {
                return [{ id: "1", name: "Nexus", tags: "...", extraData: "false" }];
            },
        });
    },
});
exports.TreeMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createTree", {
            type: "DecisionTree",
            resolve(_root, args, ctx) {
                return await context.prisma.decisionTree.create({
                    data: {
                        //TODO: add properties
                        name: args.name,
                        tags: args.tags,
                        extraData: args.extraData,
                        language: args.language,
                        owner: { connect: { id: userId } },
                    },
                });
            },
        });
    },
});
//# sourceMappingURL=DecisionTree.js.map