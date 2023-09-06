"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_js_1 = __importDefault(require("../../utils/app/route.js"));
const get_health_js_1 = __importDefault(require("../../controllers/health/get-health.js"));
const router = (0, express_1.Router)();
(0, route_js_1.default)(router, {
    method: "get",
    path: "/",
    schema: get_health_js_1.default.schema,
    controller: get_health_js_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=health.routes.js.map