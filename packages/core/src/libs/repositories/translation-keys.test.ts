import { describe, afterAll, test, expect } from "vitest";
import SQLiteAdapter from "@lucidcms/sqlite-adapter";
import Database from "better-sqlite3";
import TranslationKeysRepository from "./translation-keys";

describe("Tests for the translations keys repository", async () => {
	const db = new SQLiteAdapter({
		database: async () => new Database(":memory:"),
	});

	afterAll(() => {
		db.client.destroy();
	});

	await db.migrateToLatest();
	const TranslationKeys = new TranslationKeysRepository(db.client, db);
	const tables = await db.client.introspection.getTables();

	test("checks the columnFormats matches the latest state of the DB", async () => {
		const table = tables.find((t) => t.name === TranslationKeys.tableName);
		expect(table).toBeDefined();

		for (const column of table?.columns || []) {
			expect(TranslationKeys.columnFormats[column.name]).toEqual(
				column.dataType.toLowerCase(),
			);
		}
	});
});
