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
                where: { owner: { id: user.id } },
            });
        }
    }
}
exports.TreeService = TreeService;
//# sourceMappingURL=TreeService.js.map