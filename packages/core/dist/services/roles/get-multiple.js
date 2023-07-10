"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Role_1 = __importDefault(require("../../db/models/Role"));
const getMultiple = async (data) => {
    const roles = await Role_1.default.getMultiple(data.query);
    return roles;
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map