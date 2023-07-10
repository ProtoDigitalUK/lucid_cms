"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../../db/models/Category"));
const categories_1 = __importDefault(require("../categories"));
const error_handler_1 = require("../../utils/app/error-handler");
const updateSingle = async (data) => {
    const currentCategory = await categories_1.default.getSingle({
        environment_key: data.environment_key,
        id: data.id,
    });
    if (data.data.slug) {
        const isSlugUnique = await Category_1.default.isSlugUniqueInCollection({
            collection_key: currentCategory.collection_key,
            slug: data.data.slug,
            environment_key: data.environment_key,
            ignore_id: data.id,
        });
        if (!isSlugUnique) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Category Not Updated",
                message: "Please provide a unique slug within this post type.",
                status: 400,
                errors: (0, error_handler_1.modelErrors)({
                    slug: {
                        code: "not_unique",
                        message: "Please provide a unique slug within this post type.",
                    },
                }),
            });
        }
    }
    return await Category_1.default.updateSingle(data.environment_key, data.id, data.data);
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map