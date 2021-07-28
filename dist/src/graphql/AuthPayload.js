"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPayload = void 0;
const nexus_1 = require("nexus");
const User_1 = require("./User");
exports.AuthPayload = nexus_1.objectType({
    name: "AuthPayload",
    definition(t) {
        t.string("token");
        t.field("user", { type: User_1.User });
    },
});
//# sourceMappingURL=AuthPayload.js.map