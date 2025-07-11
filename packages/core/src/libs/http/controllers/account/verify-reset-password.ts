import T from "../../../../translations/index.js";
import { createFactory } from "hono/factory";
import validate from "../../middleware/validate.js";
import { controllerSchemas } from "../../../../schemas/account.js";
import { describeRoute } from "hono-openapi";
import services from "../../../../services/index.js";
import serviceWrapper from "../../../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../../../utils/errors/index.js";
import {
	honoSwaggerResponse,
	honoSwaggerParamaters,
} from "../../../../utils/swagger/index.js";

const factory = createFactory();

const verifyResetPasswordController = factory.createHandlers(
	describeRoute({
		description: "Verifies the password reset token is valid.",
		tags: ["account"],
		summary: "Verify Reset Token",
		responses: honoSwaggerResponse(),
		parameters: honoSwaggerParamaters({
			params: controllerSchemas.verifyResetPassword.params,
		}),
		validateResponse: true,
	}),
	validate("param", controllerSchemas.verifyResetPassword.params),
	async (c) => {
		const { token } = c.req.valid("param");

		const tokenResult = await serviceWrapper(services.user.token.getSingle, {
			transaction: false,
			defaultError: {
				type: "basic",
				name: T("route_verify_password_reset_error_name"),
				message: T("route_verify_password_reset_error_message"),
			},
		})(
			{
				db: c.get("config").db.client,
				config: c.get("config"),
				services: services,
			},
			{
				tokenType: "password_reset",
				token: token,
			},
		);

		if (tokenResult.error) throw new LucidAPIError(tokenResult.error);

		c.status(204);
		return c.body(null);
	},
);

export default verifyResetPasswordController;
