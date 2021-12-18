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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewTreeInput = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
let NewTreeInput = class NewTreeInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], NewTreeInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NewTreeInput.prototype, "treeData", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NewTreeInput.prototype, "tags", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], NewTreeInput.prototype, "language", void 0);
NewTreeInput = __decorate([
    (0, type_graphql_1.InputType)()
], NewTreeInput);
exports.NewTreeInput = NewTreeInput;
// @ArgsType()
// export class TreeArgs {
//   @Field((type) => Int)
//   @Min(0)
//   skip: number = 0;
//   @Field((type) => Int)
//   @Min(1)
//   @Max(50)
//   take: number = 25;
// }
//# sourceMappingURL=input-arguments-types.js.map