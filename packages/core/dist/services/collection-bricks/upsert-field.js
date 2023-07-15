"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("../../utils/app/service"));
const error_handler_1 = require("../../utils/app/error-handler");
const CollectionBrick_1 = __importDefault(require("../../db/models/CollectionBrick"));
const collection_bricks_1 = __importDefault(require("../collection-bricks"));
const upsertField = async (client, data) => {
    let fieldId;
    const brickField = data.data;
    await (0, service_1.default)(collection_bricks_1.default.checkFieldExists, false, client)({
        brick_id: data.brick_id,
        key: brickField.key,
        type: brickField.type,
        parent_repeater: brickField.parent_repeater,
        group_position: brickField.group_position,
        create: brickField.fields_id !== undefined ? false : true,
    });
    if (brickField.fields_id) {
        const fieldRes = await CollectionBrick_1.default.updateField(client, {
            brick_id: data.brick_id,
            field: brickField,
        });
        fieldId = fieldRes.fields_id;
    }
    else {
        const fieldRes = await CollectionBrick_1.default.createField(client, {
            brick_id: data.brick_id,
            field: brickField,
        });
        if (!fieldRes) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Field Create Error",
                message: `Could not create field "${brickField.key}" for brick "${data.brick_id}".`,
                status: 500,
            });
        }
        fieldId = fieldRes.fields_id;
    }
    return fieldId;
};
exports.default = upsertField;
//# sourceMappingURL=upsert-field.js.map