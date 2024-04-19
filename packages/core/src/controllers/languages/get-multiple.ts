import T from "../../translations/index.js";
import languageSchema from "../../schemas/languages.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import languagesServices from "../../services/languages/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import LanguagesFormatter from "../../libs/formatters/languages.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const getMultipleController: RouteController<
	typeof languageSchema.getMultiple.params,
	typeof languageSchema.getMultiple.body,
	typeof languageSchema.getMultiple.query
> = async (request, reply) => {
	try {
		const languages = await serviceWrapper(
			languagesServices.getMultiple,
			false,
		)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				query: request.query,
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: languages.data,
				pagination: {
					count: languages.count,
					page: request.query.page,
					perPage: request.query.perPage,
				},
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("language"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
};

export default {
	controller: getMultipleController,
	zodSchema: languageSchema.getMultiple,
	swaggerSchema: {
		description:
			"Returns multiple languages based on the query parameters.",
		tags: ["languages"],
		summary: "Get multiple language",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: LanguagesFormatter.swagger,
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