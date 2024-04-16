import type z from "zod";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { Config } from "./config.js";

import type { UserPermissionsResponse, LanguageResponse } from "./response.js";
import type { HeadlessDB, BooleanInt } from "../libs/db/types.js";
import type headlessLogger from "../libs/logging/index.js";

declare module "fastify" {
	interface FastifyInstance {
		config: Config;
		logger: typeof headlessLogger;
	}

	interface FastifyRequest {
		auth: {
			id: number;
			username: string;
			email: string;
			superAdmin: BooleanInt;
			permissions: UserPermissionsResponse["permissions"] | undefined;
		};
		language: {
			id: LanguageResponse["id"];
			code: LanguageResponse["code"];
		};
		server: FastifyInstance;
	}
}

export type RouteController<
	P extends z.ZodTypeAny | undefined,
	B extends z.ZodTypeAny | undefined,
	Q extends z.ZodTypeAny | undefined,
> = (
	request: FastifyRequest<{
		// @ts-expect-error
		Params: z.infer<P>;
		// @ts-expect-error
		Body: z.infer<B>;
		// @ts-expect-error
		Querystring: z.infer<Q>;
	}>,
	reply: FastifyReply,
) => void;