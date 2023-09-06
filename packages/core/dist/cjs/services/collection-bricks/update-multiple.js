"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../collection-bricks/index.js"));
const updateMultiple = async (client, data) => {
    const builderBricksPromise = data.builder_bricks.map((brick, index) => (0, service_js_1.default)(index_js_1.default.upsertSingle, false, client)({
        reference_id: data.id,
        brick: brick,
        brick_type: "builder",
        order: index,
        environment: data.environment,
        collection: data.collection,
    })) || [];
    const fixedBricksPromise = data.fixed_bricks.map((brick, index) => (0, service_js_1.default)(index_js_1.default.upsertSingle, false, client)({
        reference_id: data.id,
        brick: brick,
        brick_type: "fixed",
        order: index,
        environment: data.environment,
        collection: data.collection,
    })) || [];
    const [buildBrickRes, fixedBrickRes] = await Promise.all([
        Promise.all(builderBricksPromise),
        Promise.all(fixedBricksPromise),
    ]);
    const builderIds = buildBrickRes.map((brickId) => brickId);
    const fixedIds = fixedBrickRes.map((brickId) => brickId);
    if (builderIds.length > 0)
        await (0, service_js_1.default)(index_js_1.default.deleteUnused, false, client)({
            type: data.collection.type,
            reference_id: data.id,
            brick_ids: builderIds,
            brick_type: "builder",
        });
    if (fixedIds.length > 0)
        await (0, service_js_1.default)(index_js_1.default.deleteUnused, false, client)({
            type: data.collection.type,
            reference_id: data.id,
            brick_ids: fixedIds,
            brick_type: "fixed",
        });
};
exports.default = updateMultiple;
//# sourceMappingURL=update-multiple.js.map