import T from "../../translations/index.js";
import localeSchema from "../../schemas/locales.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import localesServices from "../../services/locales/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import LocalesFormatter from "../../libs/formatters/locales.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const getAllController: RouteController<
	typeof localeSchema.getAll.params,
	typeof localeSchema.getAll.body,
	typeof localeSchema.getAll.query
> = async (request, reply) => {
	try {
		const locales = await serviceWrapper(
			localesServices.getAll,
			false,
		)({
			db: request.server.config.db.client,
			config: request.server.config,
		});

		reply.status(200).send(
			await buildResponse(request, {
				data: locales,
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("locale"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
};

export default {
	controller: getAllController,
	zodSchema: localeSchema.getAll,
	swaggerSchema: {
		description: "Returns all locale.",
		tags: ["locales"],
		summary: "Get all locales",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: LocalesFormatter.swagger,
				},
				paginated: true,
			}),
		},
		querystring: swaggerQueryString({
			sorts: ["code", "createdAt", "updatedAt"],
			page: true,
			perPage: true,
		}),
	},
};