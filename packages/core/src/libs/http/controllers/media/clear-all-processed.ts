import T from "../../../../translations/index.js";
import { createFactory } from "hono/factory";
import { controllerSchemas } from "../../../../schemas/media.js";
import { describeRoute } from "hono-openapi";
import services from "../../../../services/index.js";
import serviceWrapper from "../../../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../../../utils/errors/index.js";
import {
	honoSwaggerResponse,
	honoSwaggerParamaters,
} from "../../../../utils/swagger/index.js";
import authenticate from "../../middleware/authenticate.js";
import validateCSRF from "../../middleware/validate-csrf.js";
import permissions from "../../middleware/permissions.js";

const factory = createFactory();

const clearAllProcessedController = factory.createHandlers(
	describeRoute({
		description: "Clears all processed images for a every media item.",
		tags: ["media"],
		summary: "Clear Every Processed Image",
		responses: honoSwaggerResponse({
			noProperties: true,
		}),
		parameters: honoSwaggerParamaters({
			headers: {
				csrf: true,
			},
		}),
		validateResponse: true,
	}),
	validateCSRF,
	authenticate,
	permissions(["update_media"]),
	async (c) => {
		const clearProcessed = await serviceWrapper(
			services.processedImage.clearAll,
			{
				transaction: true,
				defaultError: {
					type: "basic",
					name: T("route_media_clear_processed_error_name"),
					message: T("route_media_clear_processed_error_message"),
				},
			},
		)({
			db: c.get("config").db.client,
			config: c.get("config"),
			services: services,
		});
		if (clearProcessed.error) throw new LucidAPIError(clearProcessed.error);

		c.status(204);
		return c.body(null);
	},
);

export default clearAllProcessedController;
