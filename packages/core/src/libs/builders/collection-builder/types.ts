import type z from "zod";
import type BrickBuilder from "../brick-builder/index.js";
import type { FieldTypes, CFConfig } from "../../custom-fields/types.js";
import type CollectionConfigSchema from "./schema.js";
import type { CollectionDocumentBuilderHooks } from "../../../types/hooks.js";
import type { CFColumn } from "../../custom-fields/types.js";
import type {
	FilterValue,
	FilterOperator,
} from "../../../types/query-params.js";
import type { LocaleValue } from "../../../types/shared.js";

export interface FieldCollectionConfig {
	column?: boolean; //* internally its called "include", "column" is just the public facing name as it makes it clear how it impacts the CMS
	filterable?: boolean;
}

export interface CollectionConfigSchemaType
	extends z.infer<typeof CollectionConfigSchema> {
	hooks?: CollectionDocumentBuilderHooks[];
	bricks?: {
		fixed?: Array<BrickBuilder>;
		builder?: Array<BrickBuilder>;
	};
}

export type CollectionData = {
	key: string;
	mode: CollectionConfigSchemaType["mode"];
	details: {
		name: LocaleValue;
		singularName: LocaleValue;
		summary: LocaleValue | null;
	};
	config: {
		isLocked: boolean;
		useDrafts: boolean;
		useRevisions: boolean;
		useTranslations: boolean;
		fields: {
			filter: FieldFilters;
			include: string[];
		};
	};
};

export type FieldFilters = Array<{
	key: string;
	type: FieldTypes;
}>;

export interface CollectionBrickConfig {
	key: BrickBuilder["key"];
	details: BrickBuilder["config"]["details"];
	preview: BrickBuilder["config"]["preview"];
	fields: CFConfig<FieldTypes>[];
}

export interface DocumentFieldFilters {
	key: string;
	value: FilterValue;
	operator: FilterOperator;
	column: CFColumn<FieldTypes>;
}
