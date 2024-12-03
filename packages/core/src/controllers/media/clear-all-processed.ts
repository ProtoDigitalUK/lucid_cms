import T from "../../translations/index.js";
import mediaSchema from "../../schemas/media.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import type { RouteController } from "../../types/types.js";

const clearAllProcessedController: RouteController<
	typeof mediaSchema.clearAllProcessed.params,
	typeof mediaSchema.clearAllProcessed.body,
	typeof mediaSchema.clearAllProcessed.query
> = async (request, reply) => {
	const clearProcessed = await serviceWrapper(
		request.server.services.processedImage.clearAll,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_media_clear_processed_error_name"),
				message: T("route_media_clear_processed_error_message"),
			},
		},
	)({
		db: request.server.config.db.client,
		config: request.server.config,
		services: request.server.services,
	});
	if (clearProcessed.error) throw new LucidAPIError(clearProcessed.error);

	reply.status(204).send();
};

export default {
	controller: clearAllProcessedController,
	zodSchema: mediaSchema.clearAllProcessed,
};
