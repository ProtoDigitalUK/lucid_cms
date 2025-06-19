import T from "../../../translations/index.js";
import z from "zod/v4";
import CustomField from "../custom-field.js";
import keyToTitle from "../utils/key-to-title.js";
import zodSafeParse from "../utils/zod-safe-parse.js";
import Formatter from "../../formatters/index.js";
import buildTableName from "../../../services/collection-migrator/helpers/build-table-name.js";
import type {
	CFConfig,
	CFProps,
	CFResponse,
	DocumentReferenceData,
	GetSchemaDefinitionProps,
	SchemaDefinition,
} from "../types.js";
import type { FieldFormatMeta } from "../../formatters/document-fields.js";
import type { ServiceResponse } from "../../../types.js";
import type { BrickQueryResponse } from "../../repositories/document-bricks.js";

const DocumentFieldsFormatter = Formatter.get("document-fields");
const DocumentBricksFormatter = Formatter.get("document-bricks");

class DocumentCustomField extends CustomField<"document"> {
	type = "document" as const;
	column = "document_id" as const;
	config;
	key;
	props;
	constructor(key: string, props: CFProps<"document">) {
		super();
		this.key = key;
		this.props = props;
		this.config = {
			key: this.key,
			type: this.type,
			collection: this.props.collection,
			details: {
				label: this.props?.details?.label ?? keyToTitle(this.key),
				summary: this.props?.details?.summary,
			},
			config: {
				useTranslations: this.props?.config?.useTranslations ?? false,
				isHidden: this.props?.config?.isHidden,
				isDisabled: this.props?.config?.isDisabled,
			},
			validation: this.props?.validation,
		} satisfies CFConfig<"document">;
	}
	// Methods
	getSchemaDefinition(
		props: GetSchemaDefinitionProps,
	): Awaited<ServiceResponse<SchemaDefinition>> {
		const documentTableRes = buildTableName("document", {
			collection: this.config.collection,
		});
		if (documentTableRes.error) return documentTableRes;

		return {
			data: {
				columns: [
					{
						name: this.key,
						type: props.db.getDataType("integer"),
						nullable: true,
						foreignKey: {
							table: documentTableRes.data,
							column: "id",
							onDelete: "set null",
						},
					},
				],
			},
			error: undefined,
		};
	}
	formatResponseValue(value?: number | null) {
		return (value ?? null) satisfies CFResponse<"document">["value"];
	}
	formatResponseMeta(
		value: BrickQueryResponse | undefined | null,
		meta: FieldFormatMeta,
	) {
		if (value === null || value === undefined) return null;

		const collection = meta.config.collections.find(
			(c) => c.key === this.props.collection,
		);
		if (!collection || !value) {
			return {
				id: value?.document_id ?? null,
				collectionKey: value?.collection_key ?? null,
				fields: null,
			};
		}

		const documentFields = DocumentFieldsFormatter.objectifyFields(
			DocumentBricksFormatter.formatDocumentFields({
				bricksQuery: value,
				bricksSchema: collection.bricksTableSchema,
				relationMetaData: {},
				collection: collection,
				config: meta.config,
			}),
		);

		return {
			id: value?.id ?? null,
			collectionKey: value?.collection_key ?? null,
			fields: Object.keys(documentFields).length > 0 ? documentFields : null,
		} satisfies CFResponse<"document">["meta"];
	}
	cfSpecificValidation(value: unknown, relationData?: DocumentReferenceData[]) {
		const valueSchema = z.number();

		const valueValidate = zodSafeParse(value, valueSchema);
		if (!valueValidate.valid) return valueValidate;

		const findDocument = relationData?.find(
			(d) => d.id === value && d.collection_key === this.config.collection,
		);

		if (findDocument === undefined) {
			return {
				valid: false,
				message: T("field_document_not_found"),
			};
		}

		return { valid: true };
	}
	get translationsEnabled() {
		return this.config.config.useTranslations;
	}
	get defaultValue() {
		return null;
	}
}

export default DocumentCustomField;
