"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_js_1 = __importDefault(require("../../utils/app/route.js"));
const update_single_js_1 = __importDefault(require("../../controllers/users/update-single.js"));
const create_single_js_1 = __importDefault(require("../../controllers/users/create-single.js"));
const delete_single_js_1 = __importDefault(require("../../controllers/users/delete-single.js"));
const get_multiple_js_1 = __importDefault(require("../../controllers/users/get-multiple.js"));
const get_single_js_1 = __importDefault(require("../../controllers/users/get-single.js"));
const router = (0, express_1.Router)();
(0, route_js_1.default)(router, {
    method: "patch",
    path: "/:id",
    permissions: {
        global: ["update_user"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: update_single_js_1.default.schema,
    controller: update_single_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "post",
    path: "/",
    permissions: {
        global: ["create_user"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: create_single_js_1.default.schema,
    controller: create_single_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "delete",
    path: "/:id",
    permissions: {
        global: ["delete_user"],
    },
    middleware: {
        authenticate: true,
        authoriseCSRF: true,
    },
    schema: delete_single_js_1.default.schema,
    controller: delete_single_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "get",
    path: "/",
    middleware: {
        authenticate: true,
        paginated: true,
    },
    schema: get_multiple_js_1.default.schema,
    controller: get_multiple_js_1.default.controller,
});
(0, route_js_1.default)(router, {
    method: "get",
    path: "/:id",
    middleware: {
        authenticate: true,
    },
    schema: get_single_js_1.default.schema,
    controller: get_single_js_1.default.controller,
});
exports.default = router;
//# sourceMappingURL=users.routes.js.map