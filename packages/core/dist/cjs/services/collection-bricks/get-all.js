"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CollectionBrick_js_1 = __importDefault(require("../../db/models/CollectionBrick.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../environments/index.js"));
const format_bricks_js_1 = __importDefault(require("../../utils/format/format-bricks.js"));
const getAll = async (client, data) => {
    const brickFields = await CollectionBrick_js_1.default.getAll(client, {
        reference_id: data.reference_id,
        type: data.type,
    });
    if (!brickFields) {
        return {
            builder_bricks: [],
            fixed_bricks: [],
        };
    }
    const environment = await (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
        key: data.environment_key,
    });
    const formmatedBricks = await (0, format_bricks_js_1.default)({
        brick_fields: brickFields,
        environment_key: data.environment_key,
        collection: data.collection,
        environment: environment,
    });
    return {
        builder_bricks: formmatedBricks.filter((brick) => brick.type === "builder"),
        fixed_bricks: formmatedBricks.filter((brick) => brick.type !== "builder"),
    };
};
exports.default = getAll;
//# sourceMappingURL=get-all.js.map