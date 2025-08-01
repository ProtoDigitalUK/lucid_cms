import T from "../../../../translations/index.js";
import { createFactory } from "hono/factory";
import { controllerSchemas } from "../../../../schemas/client-integrations.js";
import { describeRoute } from "hono-openapi";
import services from "../../../../services/index.js";
import serviceWrapper from "../../../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../../../utils/errors/index.js";
import {
	honoSwaggerResponse,
	honoSwaggerRequestBody,
	honoSwaggerParamaters,
} from "../../../../utils/swagger/index.js";
import authenticate from "../../middleware/authenticate.js";
import validateCSRF from "../../middleware/validate-csrf.js";
import validate from "../../middleware/validate.js";

const factory = createFactory();

const updateSingleController = factory.createHandlers(
	describeRoute({
		description: "Update a single client integration.",
		tags: ["client-integrations"],
		summary: "Update Client Integration",
		responses: honoSwaggerResponse({
			noProperties: true,
		}),
		requestBody: honoSwaggerRequestBody(controllerSchemas.updateSingle.body),
		parameters: honoSwaggerParamaters({
			headers: {
				csrf: true,
			},
			params: controllerSchemas.updateSingle.params,
		}),
		validateResponse: true,
	}),
	validateCSRF,
	authenticate,
	validate("json", controllerSchemas.updateSingle.body),
	validate("param", controllerSchemas.updateSingle.params),
	async (c) => {
		const { name, description, enabled } = c.req.valid("json");
		const { id } = c.req.valid("param");

		const updateSingleRes = await serviceWrapper(
			services.clientIntegrations.updateSingle,
			{
				transaction: true,
				defaultError: {
					type: "basic",
					name: T("route_client_integrations_update_error_name"),
					message: T("route_client_integrations_update_error_message"),
				},
			},
		)(
			{
				db: c.get("config").db.client,
				config: c.get("config"),
				services: services,
			},
			{
				id: Number.parseInt(id),
				name,
				description,
				enabled,
			},
		);
		if (updateSingleRes.error) throw new LucidAPIError(updateSingleRes.error);

		c.status(204);
		return c.body(null);
	},
);

export default updateSingleController;
