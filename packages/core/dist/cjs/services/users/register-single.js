"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const User_js_1 = __importDefault(require("../../db/models/User.js"));
const index_js_1 = __importDefault(require("../users/index.js"));
const format_user_js_1 = __importDefault(require("../../utils/format/format-user.js"));
const registerSingle = async (client, data, current_user_id) => {
    let superAdmin = data.super_admin;
    const checkUserProm = Promise.all([
        (0, service_js_1.default)(index_js_1.default.getSingleQuery, false, client)({
            email: data.email,
        }),
        (0, service_js_1.default)(index_js_1.default.getSingleQuery, false, client)({
            username: data.username,
        }),
    ]);
    const [userByEmail, userByUsername] = await checkUserProm;
    if (userByEmail || userByUsername) {
        const errors = {};
        if (userByEmail) {
            errors.email = {
                code: "email_already_exists",
                message: "A user with that email already exists.",
            };
        }
        if (userByUsername) {
            errors.username = {
                code: "username_already_exists",
                message: "A user with that username already exists.",
            };
        }
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "User Already Exists",
            message: "A user with that email or username already exists.",
            status: 400,
            errors: (0, error_handler_js_1.modelErrors)(errors),
        });
    }
    await (0, service_js_1.default)(index_js_1.default.checkIfUserExists, false, client)({
        email: data.email,
        username: data.username,
    });
    if (current_user_id !== undefined && data.super_admin === true) {
        const currentUser = await (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
            user_id: current_user_id,
        });
        if (!currentUser.super_admin) {
            superAdmin = false;
        }
    }
    const hashedPassword = await argon2_1.default.hash(data.password);
    const user = await User_js_1.default.createSingle(client, {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        super_admin: superAdmin,
        first_name: data.first_name,
        last_name: data.last_name,
    });
    if (!user) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "User Not Created",
            message: "There was an error creating the user.",
            status: 500,
        });
    }
    if (data.role_ids && data.role_ids.length > 0) {
        await (0, service_js_1.default)(index_js_1.default.updateRoles, false, client)({
            user_id: user.id,
            role_ids: data.role_ids,
        });
    }
    const userPermissions = await (0, service_js_1.default)(index_js_1.default.getPermissions, false, client)({
        user_id: user.id,
    });
    return (0, format_user_js_1.default)(user, userPermissions);
};
exports.default = registerSingle;
//# sourceMappingURL=register-single.js.map