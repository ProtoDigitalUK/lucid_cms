import z from "zod";
import T from "../../../../translations/index.js";
import { controllerSchemas } from "../../../../schemas/account.js";
import { swaggerResponse } from "../../../../utils/swagger/index.js";
import serviceWrapper from "../../../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../../../utils/errors/index.js";
import type { RouteController } from "../../../../types/types.js";

const verifyResetPasswordController: RouteController<
	typeof controllerSchemas.verifyResetPassword.params,
	typeof controllerSchemas.verifyResetPassword.body,
	typeof controllerSchemas.verifyResetPassword.query.string,
	typeof controllerSchemas.verifyResetPassword.query.formatted
> = async (request, reply) => {
	const token = await serviceWrapper(
		request.server.services.user.token.getSingle,
		{
			transaction: false,
			defaultError: {
				type: "basic",
				name: T("route_verify_password_reset_error_name"),
				message: T("route_verify_password_reset_error_message"),
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
			services: request.server.services,
		},
		{
			tokenType: "password_reset",
			token: request.params.token,
		},
	);
	if (token.error) throw new LucidAPIError(token.error);

	reply.status(204).send();
};

export default {
	controller: verifyResetPasswordController,
	zodSchema: controllerSchemas.verifyResetPassword,
	swaggerSchema: {
		description: "Verifies the password reset token is valid.",
		tags: ["account"],
		summary: "Verify Reset Token",

		params: z.toJSONSchema(controllerSchemas.verifyResetPassword.params),
		response: swaggerResponse({
			noProperties: true,
		}),
	},
};
