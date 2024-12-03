import T from "../../translations/index.js";
import rolesSchema from "../../schemas/roles.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import type { RouteController } from "../../types/types.js";

const updateSingleController: RouteController<
	typeof rolesSchema.updateSingle.params,
	typeof rolesSchema.updateSingle.body,
	typeof rolesSchema.updateSingle.query
> = async (request, reply) => {
	const updateSingel = await serviceWrapper(
		request.server.services.role.updateSingle,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_roles_update_error_name"),
				message: T("route_roles_update_error_message"),
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
			services: request.server.services,
		},
		{
			id: Number.parseInt(request.params.id),
			name: request.body.name,
			description: request.body.description,
			permissions: request.body.permissions,
		},
	);
	if (updateSingel.error) throw new LucidAPIError(updateSingel.error);

	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: rolesSchema.updateSingle,
};
