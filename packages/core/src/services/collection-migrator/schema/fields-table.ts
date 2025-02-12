import T from "../../../translations/index.js";
import buildTableName from "../helpers/build-table-name.js";
import buildCoreColumnName from "../helpers/build-core-column-name.js";
import type {
	CollectionSchemaTable,
	CollectionSchemaColumn,
	TableType,
} from "./types.js";
import type { ServiceResponse } from "../../../types.js";
import type { CollectionBuilder } from "../../../builders.js";
import type { CFConfig, FieldTypes, TabFieldConfig } from "../../../types.js";
import type { BrickBuilder } from "../../../builders.js";
import type DatabaseAdapter from "../../../libs/db/adapter.js";

/**
 * Creates table schemas for fields
 * Handles document fields, brick fields, and repeater fields
 */
const createFieldTables = (props: {
	collection: CollectionBuilder;
	fields: Exclude<CFConfig<FieldTypes>, TabFieldConfig>[];
	db: DatabaseAdapter;
	type: Extract<TableType, "document-fields" | "brick" | "repeater">;
	documentTable: string;
	versionTable: string;
	brick?: BrickBuilder;
	repeaterKeys?: string[];
	parentTable?: string;
}): Awaited<
	ServiceResponse<{
		schema: CollectionSchemaTable;
		childTables: CollectionSchemaTable[];
	}>
> => {
	const tableNameRes = buildTableName(props.type, {
		collection: props.collection.key,
		brick: props.brick?.key,
		repeater: props.repeaterKeys,
	});
	if (tableNameRes.error) return tableNameRes;

	const childTables: CollectionSchemaTable[] = [];
	const columns: CollectionSchemaColumn[] = [
		{
			name: buildCoreColumnName("id"),
			source: "core",
			type: props.db.getDataType("primary"),
			nullable: false,
			primary: true,
		},
		{
			name: buildCoreColumnName("collection_key"),
			source: "core",
			type: props.db.getDataType("text"),
			nullable: false,
			foreignKey: {
				table: "lucid_collections",
				column: "key",
				onDelete: "cascade",
			},
		},
		{
			name: buildCoreColumnName("document_id"),
			source: "core",
			type: props.db.getDataType("integer"),
			nullable: false,
			foreignKey: {
				table: props.documentTable,
				column: "id",
				onDelete: "cascade",
			},
		},
		{
			name: buildCoreColumnName("document_version_id"),
			source: "core",
			type: props.db.getDataType("integer"),
			nullable: false,
			foreignKey: {
				table: props.versionTable,
				column: "id",
				onDelete: "cascade",
			},
		},
		{
			name: buildCoreColumnName("locale"),
			source: "core",
			type: props.db.getDataType("text"),
			nullable: false,
			foreignKey: {
				table: "lucid_locales",
				column: "code",
				onDelete: "cascade",
			},
		},
	];

	//* add repeater columns
	if (props.type === "repeater") {
		// add parent reference for repeater fields
		if (props.parentTable) {
			columns.push({
				name: buildCoreColumnName("parent_id"),
				source: "core",
				type: props.db.getDataType("integer"),
				nullable: false,
				foreignKey: {
					table: props.parentTable,
					column: buildCoreColumnName("id"),
					onDelete: "cascade",
				},
			});
		}
		// add sorting for repeater items
		columns.push({
			name: buildCoreColumnName("sort_order"),
			source: "core",
			type: props.db.getDataType("integer"),
			nullable: false,
			default: 0,
		});
	}

	//* process field columns
	for (const field of props.fields) {
		if (field.type === "repeater") {
			const repeaterKeys = (props.repeaterKeys || []).concat(field.key);

			const repeaterTableRes = createFieldTables({
				collection: props.collection,
				fields: field.fields,
				db: props.db,
				type: "repeater",
				documentTable: props.documentTable,
				versionTable: props.versionTable,
				brick: props.brick,
				repeaterKeys: repeaterKeys,
				parentTable: tableNameRes.data,
			});
			if (repeaterTableRes.error) return repeaterTableRes;

			childTables.push(repeaterTableRes.data.schema);
			childTables.push(...repeaterTableRes.data.childTables);
		} else {
			//* field keys are unique within a collection, if we ever change them to be unique within a block (base layer and repeaters) we need to update this
			const fieldInstance = (props.brick || props.collection).fields.get(
				field.key,
			);
			if (!fieldInstance) {
				return {
					data: undefined,
					error: {
						message: T("cannot_find_field_with_key_in_collection_brick", {
							key: field.key,
							type: props.brick ? "brick" : "collection",
							typeKey: props.brick ? props.brick.key : props.collection.key,
						}),
					},
				};
			}

			const fieldSchema = fieldInstance.getSchemaDefinition({
				db: props.db,
				tables: {
					document: props.documentTable,
					version: props.versionTable,
				},
			});

			for (const column of fieldSchema.columns) {
				columns.push({
					name: column.name,
					source: "field",
					type: column.type,
					nullable: column.nullable,
					foreignKey: column.foreignKey,
					//* holding off on default value contraint on custom field columns due to sqlite/libsql adapters not supporting the alter column operation and instead having to drop+add the column again resulting in data loss.
					//* CF default values are a lot more likely to be edited than the others and in a way where a user wouldnt expect data loss - so until we have a solution here, no default contraints for CF exist
					default: props.db.supports("alterColumn") ? column.default : null,
				});
			}
		}
	}

	return {
		data: {
			schema: {
				name: tableNameRes.data,
				type: props.type,
				key: {
					collection: props.collection.key,
					brick: props.brick?.key,
					repeater: props.repeaterKeys,
				},
				columns: columns,
			},
			childTables: childTables,
		},
		error: undefined,
	};
};

export default createFieldTables;
