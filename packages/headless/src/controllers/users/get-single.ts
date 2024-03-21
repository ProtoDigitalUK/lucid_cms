import usersSchema from "../../schemas/users.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import usersServices from "../../services/users/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerUsersRes } from "../../format/format-user.js";

const getSingleController: ControllerT<
	typeof usersSchema.getSingle.params,
	typeof usersSchema.getSingle.body,
	typeof usersSchema.getSingle.query
> = async (request, reply) => {
	const user = await serviceWrapper(usersServices.getSingle, false)(
		{
			db: request.server.db,
		},
		{
			user_id: parseInt(request.params.id),
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: user,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: usersSchema.getSingle,
	swaggerSchema: {
		description: "Get a single user.",
		tags: ["users"],
		summary: "Get a single user.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerUsersRes,
			}),
		},
	},
};