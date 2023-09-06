"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_js_1 = require("../../utils/app/query-helpers.js");
const Media_js_1 = __importDefault(require("../../db/models/Media.js"));
const format_media_js_1 = __importDefault(require("../../utils/format/format-media.js"));
const getMultiple = async (client, data) => {
    const { filter, sort, page, per_page } = data.query;
    const SelectQuery = new query_helpers_js_1.SelectQueryBuilder({
        columns: [
            "id",
            "key",
            "e_tag",
            "type",
            "name",
            "alt",
            "mime_type",
            "file_extension",
            "file_size",
            "width",
            "height",
            "created_at",
            "updated_at",
        ],
        filter: {
            data: filter,
            meta: {
                type: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
                name: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                key: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                mime_type: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
                file_extension: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const mediasRes = await Media_js_1.default.getMultiple(client, SelectQuery);
    return {
        data: mediasRes.data.map((media) => (0, format_media_js_1.default)(media)),
        count: mediasRes.count,
    };
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map