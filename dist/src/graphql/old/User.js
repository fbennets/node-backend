"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const nexus_1 = require("nexus");
const DecisionTree_1 = require("./DecisionTree");
exports.User = nexus_1.objectType({
    name: "User",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.nonNull.string("email");
        t.nonNull.list.nonNull.field("DecisionTrees", { type: DecisionTree_1.DecisionTree });
    },
});
//# sourceMappingURL=User.js.map