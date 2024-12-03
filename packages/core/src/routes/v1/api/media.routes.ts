import type { FastifyInstance } from "fastify";
import r from "../../../utils/route.js";
import media from "../../../controllers/media/index.js";

const mediaRoutes = async (fastify: FastifyInstance) => {
	r(fastify, {
		method: "get",
		url: "/:id",
		middleware: {
			authenticate: true,
		},
		zodSchema: media.getSingle.zodSchema,
		controller: media.getSingle.controller,
	});

	r(fastify, {
		method: "get",
		url: "",
		middleware: {
			authenticate: true,
			contentLocale: true,
		},
		zodSchema: media.getMultiple.zodSchema,
		controller: media.getMultiple.controller,
	});

	r(fastify, {
		method: "post",
		url: "/presigned-url",
		permissions: ["create_media", "update_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		zodSchema: media.getPresignedUrl.zodSchema,
		controller: media.getPresignedUrl.controller,
	});

	r(fastify, {
		method: "post",
		url: "",
		permissions: ["create_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		zodSchema: media.createSingle.zodSchema,
		controller: media.createSingle.controller,
	});

	r(fastify, {
		method: "patch",
		url: "/:id",
		permissions: ["update_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		zodSchema: media.updateSingle.zodSchema,
		controller: media.updateSingle.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/:id",
		permissions: ["delete_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		zodSchema: media.deleteSingle.zodSchema,
		controller: media.deleteSingle.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/:id/processed",
		permissions: ["update_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		zodSchema: media.clearSingleProcessed.zodSchema,
		controller: media.clearSingleProcessed.controller,
	});

	r(fastify, {
		method: "delete",
		url: "/processed",
		permissions: ["update_media"],
		middleware: {
			authenticate: true,
			validateCSRF: true,
		},
		zodSchema: media.clearAllProcessed.zodSchema,
		controller: media.clearAllProcessed.controller,
	});
};

export default mediaRoutes;
