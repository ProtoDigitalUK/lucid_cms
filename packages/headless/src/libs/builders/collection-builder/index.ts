import z from "zod";
import FieldBuilder, {
	type FieldTypesT,
	type CustomFieldT,
} from "../field-builder/index.js";
import type { BrickBuilderT } from "../brick-builder/index.js";
import type {
	CollectionTextConfigT,
	FieldCollectionConfigT,
	CollectionNumberConfigT,
	CollectionCheckboxConfigT,
	CollectionSelectConfigT,
	CollectionTextareaConfigT,
	CollectionDateTimeConfigT,
} from "./types.js";
import type { CollectionDocumentBuilderHooks } from "../../../types/hooks.js";

export default class CollectionBuilder extends FieldBuilder {
	key: string;
	config: CollectionConfigSchemaT;
	includeFieldKeys: string[] = [];
	filterableFieldKeys: FieldFiltersT = [];
	constructor(key: string, config: CollectionConfigSchemaT) {
		super();
		this.key = key;
		this.config = config;

		if (this.config.bricks?.fixed) {
			this.config.bricks.fixed = this.#removeDuplicateBricks(
				config.bricks?.fixed,
			);
		}
		if (this.config.bricks?.builder) {
			this.config.bricks.builder = this.#removeDuplicateBricks(
				config.bricks?.builder,
			);
		}
	}
	// ------------------------------------
	// Builder Methods
	addText(config: CollectionTextConfigT) {
		this.#fieldCollectionHelper(config.key, "text", config.collection);
		super.addText(config);
		return this;
	}
	addNumber(config: CollectionNumberConfigT) {
		this.#fieldCollectionHelper(config.key, "number", config.collection);
		super.addNumber(config);
		return this;
	}
	addCheckbox(config: CollectionCheckboxConfigT) {
		this.#fieldCollectionHelper(config.key, "checkbox", config.collection);
		super.addCheckbox(config);
		return this;
	}
	addSelect(config: CollectionSelectConfigT) {
		this.#fieldCollectionHelper(config.key, "select", config.collection);
		super.addSelect(config);
		return this;
	}
	addTextarea(config: CollectionTextareaConfigT) {
		this.#fieldCollectionHelper(config.key, "textarea", config.collection);
		super.addTextarea(config);
		return this;
	}
	addDateTime(config: CollectionDateTimeConfigT) {
		this.#fieldCollectionHelper(config.key, "datetime", config.collection);
		super.addDateTime(config);
		return this;
	}
	// ------------------------------------
	// Private Methods
	#removeDuplicateBricks = (bricks?: Array<BrickBuilderT>) => {
		if (!bricks) return undefined;

		return bricks.filter(
			(brick, index) =>
				bricks.findIndex((b) => b.key === brick.key) === index,
		);
	};
	#fieldCollectionHelper = (
		key: string,
		type: FieldTypesT,
		config?: FieldCollectionConfigT,
	) => {
		if (config?.list) this.includeFieldKeys.push(key);
		if (config?.filterable)
			this.filterableFieldKeys.push({
				key,
				type,
			});
	};
	// ------------------------------------
	// Getters
	get data(): CollectionDataT {
		return {
			key: this.key,
			mode: this.config.mode,
			title: this.config.title,
			singular: this.config.singular,
			description: this.config.description ?? null,
			config: {
				translations: this.config?.translations ?? false,
				fields: {
					filter: this.filterableFieldKeys,
					include: this.includeFieldKeys,
				},
			},
		};
	}
	get fixedBricks(): Array<CollectionBrickConfigT> {
		return (
			this.config.bricks?.fixed?.map((brick) => ({
				key: brick.key,
				title: brick.config.title,
				preview: brick.config.preview,
				fields: brick.fieldTree,
			})) ?? []
		);
	}
	get builderBricks(): Array<CollectionBrickConfigT> {
		return (
			this.config.bricks?.builder?.map((brick) => ({
				key: brick.key,
				title: brick.config.title,
				preview: brick.config.preview,
				fields: brick.fieldTree,
			})) ?? []
		);
	}
	get brickInstances(): Array<BrickBuilderT> {
		return [
			...(this.config.bricks?.builder || []),
			...(this.config.bricks?.fixed || []),
		];
	}
}

export const CollectionConfigSchema = z.object({
	mode: z.enum(["single", "multiple"]),

	title: z.string(),
	singular: z.string(),
	description: z.string().optional(),
	translations: z.boolean().default(false).optional(),
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

interface CollectionConfigSchemaT
	extends z.infer<typeof CollectionConfigSchema> {
	hooks?: CollectionDocumentBuilderHooks[];
	bricks?: {
		fixed?: Array<BrickBuilderT>;
		builder?: Array<BrickBuilderT>;
	};
}

export type CollectionDataT = {
	key: string;
	mode: CollectionConfigSchemaT["mode"];
	title: CollectionConfigSchemaT["title"];
	singular: CollectionConfigSchemaT["singular"];
	description: string | null;
	config: {
		translations: boolean;
		fields: {
			filter: FieldFiltersT;
			include: string[];
		};
	};
};

export type FieldFiltersT = Array<{
	key: string;
	type: FieldTypesT;
}>;

export interface CollectionBrickConfigT {
	key: BrickBuilderT["key"];
	title: BrickBuilderT["config"]["title"];
	preview: BrickBuilderT["config"]["preview"];
	fields: CustomFieldT[];
}

export type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;
