"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeService = void 0;
class TreeService {
    async findById(id, userUuid, prisma) {
        return prisma.decisionTree.findMany({
            where: { owner: { uuid: userUuid.toString() } },
        });
    }
    async findAll(userUuid, prisma) {
        return prisma.decisionTree.findMany({
            where: { owner: { uuid: userUuid.toString() } },
        });
    }
    async addNew(newTreeData, userUuid, prisma) {
        return prisma.decisionTree.create({
            data: {
                ...newTreeData,
                owner: { connect: { uuid: userUuid.toString() } },
                tags: JSON.parse(newTreeData.tags || "{}"),
                treeData: JSON.parse(newTreeData.treeData || "{}"),
            },
        });
    }
}
exports.TreeService = TreeService;
//# sourceMappingURL=tree-service.js.map