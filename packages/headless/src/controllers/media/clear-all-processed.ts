import mediaSchema from "../../schemas/media.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import processedImagesServices from "../../services/processed-images/index.js";

const clearAllProcessedController: ControllerT<
	typeof mediaSchema.clearAllProcessed.params,
	typeof mediaSchema.clearAllProcessed.body,
	typeof mediaSchema.clearAllProcessed.query
> = async (request, reply) => {
	await serviceWrapper(
		processedImagesServices.clearAll,
		true,
	)({
		db: request.server.db,
	});

	reply.status(204).send();
};

export default {
	controller: clearAllProcessedController,
	zodSchema: mediaSchema.clearAllProcessed,
	swaggerSchema: {
		description: "Clear all processed images for a every media item.",
		tags: ["media"],
		summary: "Clear all processed images.",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};