"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUID = void 0;
const isUUID_1 = __importDefault(require("validator/lib/isUUID"));
class UUID {
    constructor(str) {
        this.str = str;
    }
    toString() {
        return this.str;
    }
    isValid() {
        return (0, isUUID_1.default)(this.str);
    }
}
exports.UUID = UUID;
//# sourceMappingURL=uuid-class.js.map