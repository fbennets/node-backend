"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeService = void 0;
class TreeService {
    findById(user, id, context) {
        if (!user) {
            throw new Error("Unauthorized");
        }
        else {
            return context.prisma.decisionTree.findMany({
                where: { owner: { uuid: user.uuid } },
            });
        }
    }
}
exports.TreeService = TreeService;
//# sourceMappingURL=tree-service.js.map