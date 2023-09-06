"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const FormSubmission_js_1 = __importDefault(require("../../db/models/FormSubmission.js"));
const index_js_1 = __importDefault(require("../form-submissions/index.js"));
const index_js_2 = __importDefault(require("../forms/index.js"));
const format_form_submission_js_1 = __importDefault(require("../../utils/format/format-form-submission.js"));
const getSingle = async (client, data) => {
    await (0, service_js_1.default)(index_js_1.default.hasEnvironmentPermission, false, client)(data);
    const formSubmission = await FormSubmission_js_1.default.getSingle(client, {
        id: data.id,
        form_key: data.form_key,
        environment_key: data.environment_key,
    });
    if (!formSubmission) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Form Error",
            message: "This form submission does not exist.",
            status: 404,
        });
    }
    let formData = await FormSubmission_js_1.default.getAllFormData(client, {
        submission_ids: [formSubmission.id],
    });
    formData = formData.filter((field) => field.form_submission_id === formSubmission.id);
    const formBuilder = index_js_2.default.getBuilderInstance({
        form_key: formSubmission.form_key,
    });
    return (0, format_form_submission_js_1.default)(formBuilder, {
        submission: formSubmission,
        data: formData,
    });
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map