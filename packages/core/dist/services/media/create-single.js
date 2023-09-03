"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/media/helpers"));
const service_1 = __importDefault(require("../../utils/app/service"));
const error_handler_1 = require("../../utils/app/error-handler");
const Media_1 = __importDefault(require("../../db/models/Media"));
const media_1 = __importDefault(require("../media"));
const s3_1 = __importDefault(require("../s3"));
const format_media_1 = __importDefault(require("../../utils/format/format-media"));
const createSingle = async (client, data) => {
    if (!data.files || !data.files["file"]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "No files provided",
            message: "No files provided",
            status: 400,
            errors: (0, error_handler_1.modelErrors)({
                file: {
                    code: "required",
                    message: "No files provided",
                },
            }),
        });
    }
    const files = helpers_1.default.formatReqFiles(data.files);
    const firstFile = files[0];
    await (0, service_1.default)(media_1.default.canStoreFiles, false, client)({
        files,
    });
    const key = helpers_1.default.uniqueKey(data.name || firstFile.name);
    const meta = await helpers_1.default.getMetaData(firstFile);
    const type = helpers_1.default.getMediaType(meta.mimeType);
    const response = await s3_1.default.saveObject({
        type: "file",
        key: key,
        file: firstFile,
        meta,
    });
    if (response.$metadata.httpStatusCode !== 200) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Error saving file",
            message: "Error saving file",
            status: 500,
            errors: (0, error_handler_1.modelErrors)({
                file: {
                    code: "required",
                    message: "Error saving file",
                },
            }),
        });
    }
    const media = await Media_1.default.createSingle(client, {
        key: key,
        name: data.name || firstFile.name,
        alt: data.alt,
        etag: response.ETag?.replace(/"/g, ""),
        type: type,
        meta: meta,
    });
    if (!media) {
        await s3_1.default.deleteObject({
            key,
        });
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Error saving file",
            message: "Error saving file",
            status: 500,
            errors: (0, error_handler_1.modelErrors)({
                file: {
                    code: "required",
                    message: "Error saving file",
                },
            }),
        });
    }
    await (0, service_1.default)(media_1.default.setStorageUsed, false, client)({
        add: meta.size,
    });
    return (0, format_media_1.default)(media);
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map