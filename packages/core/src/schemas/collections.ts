import z from "zod";
import { brickConfigSchema } from "./collection-bricks.js";
import { fieldConfigSchema } from "./collection-fields.js";
import type { ControllerSchema } from "../types.js";

const collectionResponseSchema = z.interface({
	key: z.string().meta({
		description: "The collection key",
		example: "page",
	}),
	mode: z.enum(["single", "multiple"]).meta({
		description:
			"Whether the collection has one document or multiple documents",
		example: "multiple",
	}),
	"documentId?": z
		.number()
		.nullable()
		.meta({
			description:
				'The document ID if the collection is mode "single" and had one created',
			example: 1,
		})
		.optional(),
	details: z.object({
		name: z.any().meta({
			description: "Display name for the collection",
			example: "Pages",
		}),
		singularName: z.any().meta({
			description: "Singular display name for items in the collection",
			example: { en: "Page" },
		}),
		summary: z.any().nullable().meta({
			description: "Description text for the collection",
			example: "Manage the pages and content on your website.",
		}),
	}),
	config: z.object({
		useTranslations: z.boolean().meta({
			description: "Whether the collection supports translations",
			example: true,
		}),
		useDrafts: z.boolean().meta({
			description: "Whether the collection supports draft documents",
			example: true,
		}),
		useRevisions: z.boolean().meta({
			description: "Whether the collection supports document revisions",
			example: true,
		}),
		isLocked: z.boolean().meta({
			description: "Whether the collection structure is locked from editing",
			example: false,
		}),
		displayInListing: z.array(z.string()).meta({
			description: "Field keys to display in the document listing columns",
			example: ["pageTitle", "author", "fullSlug", "slug"],
		}),
	}),
	get fixedBricks() {
		return z
			.array(brickConfigSchema)
			.meta({
				description:
					"Fixed (non-movable) bricks for all documents in the collection",
				example: [],
			})
			.optional();
	},
	get builderBricks() {
		return z
			.array(brickConfigSchema)
			.meta({
				description:
					"Builder bricks that can be added to documents in the collection",
				example: [],
			})
			.optional();
	},
	get fields() {
		return z.array(fieldConfigSchema).meta({
			description: "Fields that make up documents in the collection",
			example: [],
		});
	},
});

export const controllerSchemas = {
	getSingle: {
		body: undefined,
		query: {
			string: undefined,
			formatted: undefined,
		},
		params: z.object({
			key: z.string().meta({
				description: "The collection key",
				example: "page",
			}),
		}),
		response: collectionResponseSchema,
	} satisfies ControllerSchema,
	getAll: {
		body: undefined,
		query: {
			string: undefined,
			formatted: undefined,
		},
		params: undefined,
		response: z.array(collectionResponseSchema),
	} satisfies ControllerSchema,
};
