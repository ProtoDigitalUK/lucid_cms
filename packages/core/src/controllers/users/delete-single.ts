import T from "../../translations/index.js";
import usersSchema from "../../schemas/users.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import type { RouteController } from "../../types/types.js";

const deleteSingleController: RouteController<
	typeof usersSchema.deleteSingle.params,
	typeof usersSchema.deleteSingle.body,
	typeof usersSchema.deleteSingle.query
> = async (request, reply) => {
	const deleteSingle = await serviceWrapper(
		request.server.services.user.deleteSingle,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_user_delete_error_name"),
				message: T("route_user_delete_error_message"),
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
			services: request.server.services,
		},
		{
			userId: Number.parseInt(request.params.id),
			currentUserId: request.auth.id,
		},
	);
	if (deleteSingle.error) throw new LucidAPIError(deleteSingle.error);

	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: usersSchema.deleteSingle,
};
