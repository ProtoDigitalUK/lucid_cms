import { z } from "@lucidcms/core";
import type { ControllerSchema } from "@lucidcms/core/types";

export const controllerSchemas = {
	upload: {
		body: undefined,
		query: {
			string: z.object({
				token: z.string().meta({
					description: "The presigned URL token",
					example:
						"a64825f15c2acd40f8865933a26b7334d2c3dec3aba483cfab17396da0be8abe",
				}),
				timestamp: z.string().meta({
					description: "Timestamp",
					example: "1745601807970",
				}),
				key: z.string().meta({
					description: "The media key",
					example: "2024/09/5ttogd-placeholder-image.png",
				}),
			}),
			formatted: undefined,
		},
		params: undefined,
		response: undefined,
	} satisfies ControllerSchema,
};
