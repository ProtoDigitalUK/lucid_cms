import T from "../../../../translations/index.js";
import { createFactory } from "hono/factory";
import { controllerSchemas } from "../../../../schemas/roles.js";
import { describeRoute } from "hono-openapi";
import services from "../../../../services/index.js";
import serviceWrapper from "../../../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../../../utils/errors/index.js";
import {
	honoSwaggerResponse,
	honoSwaggerParamaters,
	honoSwaggerRequestBody,
} from "../../../../utils/swagger/index.js";
import authenticate from "../../middleware/authenticate.js";
import validateCSRF from "../../middleware/validate-csrf.js";
import validate from "../../middleware/validate.js";
import permissions from "../../middleware/permissions.js";

const factory = createFactory();

const updateSingleController = factory.createHandlers(
	describeRoute({
		description:
			"Update a single role with the given name and permission groups by ID.",
		tags: ["roles"],
		summary: "Update Role",
		responses: honoSwaggerResponse({
			noProperties: true,
		}),
		parameters: honoSwaggerParamaters({
			params: controllerSchemas.updateSingle.params,
			headers: {
				csrf: true,
			},
		}),
		requestBody: honoSwaggerRequestBody(controllerSchemas.updateSingle.body),
		validateResponse: true,
	}),
	validateCSRF,
	authenticate,
	permissions(["update_role"]),
	validate("param", controllerSchemas.updateSingle.params),
	validate("json", controllerSchemas.updateSingle.body),
	async (c) => {
		const { id } = c.req.valid("param");
		const body = c.req.valid("json");

		const updateRole = await serviceWrapper(services.role.updateSingle, {
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_roles_update_error_name"),
				message: T("route_roles_update_error_message"),
			},
		})(
			{
				db: c.get("config").db.client,
				config: c.get("config"),
				services: services,
			},
			{
				id: Number.parseInt(id, 10),
				name: body.name,
				description: body.description,
				permissions: body.permissions,
			},
		);
		if (updateRole.error) throw new LucidAPIError(updateRole.error);

		const role = await serviceWrapper(services.role.getSingle, {
			transaction: false,
			defaultError: {
				type: "basic",
				name: T("route_roles_fetch_error_name"),
				message: T("route_roles_fetch_error_message"),
			},
		})(
			{
				db: c.get("config").db.client,
				config: c.get("config"),
				services: services,
			},
			{
				id: Number.parseInt(id, 10),
			},
		);
		if (role.error) throw new LucidAPIError(role.error);

		c.status(204);
		return c.body(null);
	},
);

export default updateSingleController;
