"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_response_js_1 = __importDefault(require("../../utils/app/build-response.js"));
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const media_js_1 = __importDefault(require("../../schemas/media.js"));
const index_js_1 = __importDefault(require("../../services/processed-images/index.js"));
const clearAllProcessedController = async (req, res, next) => {
    try {
        await (0, service_js_1.default)(index_js_1.default.clearAll, false)();
        res.status(200).json((0, build_response_js_1.default)(req, {
            data: undefined,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    schema: media_js_1.default.clearAllProcessed,
    controller: clearAllProcessedController,
};
//# sourceMappingURL=clear-all-processed.js.map