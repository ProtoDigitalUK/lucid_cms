import z from "zod";
import constants from "../constants/constants.js";

export const stringTranslations = z.union([
	z.string(),
	z.record(z.enum(constants.locales), z.string()),
]);

export default {
	getSingle: {
		query: undefined,
		params: z.object({
			code: z.string().min(2),
		}),
		body: undefined,
	},
	getAll: {
		query: undefined,
		params: undefined,
		body: undefined,
	},
	client: {
		getAll: {
			query: undefined,
			params: undefined,
			body: undefined,
		},
	},
};
