"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const constants_1 = __importDefault(require("../../constants"));
const service_1 = __importDefault(require("../../utils/app/service"));
const user_tokens_1 = __importDefault(require("../user-tokens"));
const email_1 = __importDefault(require("../email"));
const users_1 = __importDefault(require("../users"));
const Config_1 = __importDefault(require("../Config"));
const sendResetPassword = async (client, data) => {
    const successMessage = `If an account with that email exists, we sent you an email with instructions to reset your password.`;
    const user = await (0, service_1.default)(users_1.default.getSingleQuery, false, client)({
        email: data.email,
    });
    if (!user) {
        return {
            message: successMessage,
        };
    }
    const expiryDate = (0, date_fns_1.add)(new Date(), { hours: 1 }).toISOString();
    const userToken = await (0, service_1.default)(user_tokens_1.default.createSingle, false, client)({
        user_id: user.id,
        token_type: "password_reset",
        expiry_date: expiryDate,
    });
    await (0, service_1.default)(email_1.default.sendEmailInternal, false, client)({
        template: "reset-password",
        params: {
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                url: `${Config_1.default.host}${constants_1.default.locations.resetPassword}?token=${userToken.token}`,
            },
            options: {
                to: user.email,
                subject: "Reset your password",
            },
        },
    });
    return {
        message: successMessage,
    };
};
exports.default = sendResetPassword;
//# sourceMappingURL=send-reset-password.js.map