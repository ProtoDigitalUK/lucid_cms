"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Media_1 = __importDefault(require("../../db/models/Media"));
const updateSingle = async (data) => {
    const media = await Media_1.default.updateSingle(data.key, data.data);
    return media;
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map