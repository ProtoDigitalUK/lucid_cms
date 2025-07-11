import type { Kysely } from "kysely";
import type { MigrationFn } from "../types.js";
import type DatabaseAdapter from "../adapter.js";

const Migration00000006: MigrationFn = (adapter: DatabaseAdapter) => {
	return {
		async up(db: Kysely<unknown>) {
			await db.schema
				.createTable("lucid_media")
				.addColumn("id", adapter.getDataType("primary"), (col) =>
					adapter.primaryKeyColumnBuilder(col),
				)
				.addColumn("key", adapter.getDataType("text"), (col) =>
					col.unique().notNull(),
				)
				.addColumn("e_tag", adapter.getDataType("text"))
				.addColumn("public", adapter.getDataType("boolean"), (col) =>
					col
						.notNull()
						.defaultTo(
							adapter.formatDefaultValue(
								"boolean",
								adapter.getDefault("boolean", "true"),
							),
						),
				)
				.addColumn("type", adapter.getDataType("text"), (col) => col.notNull())
				.addColumn("mime_type", adapter.getDataType("text"), (col) =>
					col.notNull(),
				)
				.addColumn("file_extension", adapter.getDataType("text"), (col) =>
					col.notNull(),
				)
				.addColumn("file_size", adapter.getDataType("integer"), (col) =>
					col.notNull(),
				)
				.addColumn("width", adapter.getDataType("integer"))
				.addColumn("height", adapter.getDataType("integer"))
				.addColumn("blur_hash", adapter.getDataType("text"))
				.addColumn("average_colour", adapter.getDataType("text"))
				.addColumn("is_dark", adapter.getDataType("boolean"))
				.addColumn("is_light", adapter.getDataType("boolean"))
				.addColumn(
					"title_translation_key_id",
					adapter.getDataType("integer"),
					(col) =>
						col
							.references("lucid_translation_keys.id")
							.onDelete("set null")
							.onUpdate("cascade"),
				)
				.addColumn(
					"alt_translation_key_id",
					adapter.getDataType("integer"),
					(col) =>
						col
							.references("lucid_translation_keys.id")
							.onDelete("set null")
							.onUpdate("cascade"),
				)
				.addColumn("custom_meta", adapter.getDataType("text"))
				.addColumn("created_at", adapter.getDataType("timestamp"), (col) =>
					col.defaultTo(
						adapter.formatDefaultValue(
							"timestamp",
							adapter.getDefault("timestamp", "now"),
						),
					),
				)
				.addColumn("updated_at", adapter.getDataType("timestamp"), (col) =>
					col.defaultTo(
						adapter.formatDefaultValue(
							"timestamp",
							adapter.getDefault("timestamp", "now"),
						),
					),
				)
				.execute();

			await db.schema
				.createIndex("idx_lucid_media_key")
				.on("lucid_media")
				.column("key")
				.execute();

			await db.schema
				.createTable("lucid_media_awaiting_sync")
				.addColumn("key", adapter.getDataType("text"), (col) =>
					col.primaryKey(),
				)
				.addColumn("timestamp", adapter.getDataType("timestamp"), (col) =>
					col.notNull(),
				)
				.execute();

			await db.schema
				.createTable("lucid_processed_images")
				.addColumn("key", adapter.getDataType("text"), (col) =>
					col.primaryKey(),
				)
				.addColumn("media_key", adapter.getDataType("text"), (col) =>
					col
						.references("lucid_media.key")
						.onDelete("cascade")
						.onUpdate("cascade"),
				)
				.addColumn("file_size", adapter.getDataType("integer"), (col) =>
					col.notNull(),
				)
				.execute();

			await db.schema
				.createIndex("idx_processed_images_media_key")
				.on("lucid_processed_images")
				.column("media_key")
				.execute();
		},
		async down(db: Kysely<unknown>) {},
	};
};
export default Migration00000006;
