import z from "zod";
import C from "../../../constants/constants.js";

const CollectionConfigSchema = z.object({
	mode: z.enum(["single", "multiple"]),
	details: z.object({
		name: z.string(),
		singularName: z.string(),
		summary: z.string().optional(),
	}),
	config: z
		.object({
			isLocked: z.boolean().default(C.collectionBuilder.isLocked).optional(),
			useTranslations: z
				.boolean()
				.default(C.collectionBuilder.useTranslations)
				.optional(),
			useDrafts: z.boolean().default(C.collectionBuilder.useDrafts).optional(),
			useRevisions: z
				.boolean()
				.default(C.collectionBuilder.useRevisions)
				.optional(),
		})
		.optional(),
	hooks: z
		.array(
			z.object({
				event: z.string(),
				handler: z.unknown(),
			}),
		)
		.optional(),
	bricks: z
		.object({
			fixed: z.array(z.unknown()).optional(),
			builder: z.array(z.unknown()).optional(),
		})
		.optional(),
});

export default CollectionConfigSchema;
