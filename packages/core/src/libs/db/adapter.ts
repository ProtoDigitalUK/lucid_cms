import T from "../../translations/index.js";
import {
	type Dialect,
	Kysely,
	Migrator,
	type KyselyPlugin,
	type ColumnDataType,
	type ColumnDefinitionBuilder,
} from "kysely";
import constants from "../../constants/constants.js";
import type { jsonArrayFrom } from "kysely/helpers/sqlite";
import { LucidError } from "../../utils/errors/index.js";
import logger from "../../utils/logging/index.js";
import type {
	LucidDB,
	DatabaseConfig,
	InferredTable,
	KyselyDB,
} from "./types.js";
// Migrations
import Migration00000001 from "./migrations/00000001-locales.js";
import Migration00000002 from "./migrations/00000002-translations.js";
import Migration00000003 from "./migrations/00000003-options.js";
import Migration00000004 from "./migrations/00000004-users-and-permissions.js";
import Migration00000005 from "./migrations/00000005-emails.js";
import Migration00000006 from "./migrations/00000006-media.js";
import Migration00000007 from "./migrations/00000007-collections.js";
import Migration00000008 from "./migrations/00000008-integrations.js";

export default abstract class DatabaseAdapter {
	db: Kysely<LucidDB> | undefined;
	adapter: string;
	constructor(config: {
		adapter: string;
		dialect: Dialect;
		plugins?: Array<KyselyPlugin>;
	}) {
		this.adapter = config.adapter;
		this.db = new Kysely<LucidDB>({
			dialect: config.dialect,
			plugins: config.plugins,
		});
	}
	abstract get jsonArrayFrom(): typeof jsonArrayFrom;
	abstract get config(): DatabaseConfig;
	abstract formatInsertValue(type: ColumnDataType, value: unknown): unknown;

	/**
	 * Infers the database schema. Uses the transaction client if provided, otherwise falls back to the base client
	 */
	abstract inferSchema(tx?: KyselyDB): Promise<InferredTable[]>;

	/**
	 * Runs all migrations that have not been ran yet. This doesnt include the generated migrations for collections
	 * @todo expose migrations so they can be extended?
	 */
	async migrateToLatest() {
		const migrations = {
			"00000001-locales": Migration00000001(this),
			"00000002-translations": Migration00000002(this),
			"00000003-options": Migration00000003(this),
			"00000004-users-and-permissions": Migration00000004(this),
			"00000005-emails": Migration00000005(this),
			"00000006-media": Migration00000006(this),
			"00000007-collections": Migration00000007(this),
			"00000008-integrations": Migration00000008(this),
		};

		const migrator = new Migrator({
			db: this.client,
			provider: {
				async getMigrations() {
					return migrations;
				},
			},
		});

		const { error, results } = await migrator.migrateToLatest();

		if (results) {
			for (const it of results) {
				if (it.status === "Success") {
					logger("debug", {
						message: `"${it.migrationName}" was executed successfully`,
						scope: constants.logScopes.migrations,
					});
				} else if (it.status === "Error") {
					logger("error", {
						message: `failed to execute migration "${it.migrationName}"`,
						scope: constants.logScopes.migrations,
					});
				}
			}
		}

		if (error) {
			throw new LucidError({
				message:
					error instanceof Error ? error?.message : T("db_migration_failed"),
				// @ts-expect-error
				data: error.errors,
				kill: true,
			});
		}
	}
	/**
	 * A helper for returning supported column data types
	 */
	getColumnType(
		type: keyof DatabaseConfig["dataTypes"],
		...args: unknown[]
	): ColumnDataType {
		const dataType = this.config.dataTypes[type];
		if (typeof dataType === "function") {
			// @ts-expect-error
			return dataType(...args);
		}
		return dataType;
	}
	/**
	 * A helper for extending a column definition based on auto increment support
	 */
	primaryKeyColumnBuilder(col: ColumnDefinitionBuilder) {
		return this.config.support.autoIncrement
			? col.primaryKey().autoIncrement()
			: col.primaryKey();
	}
	/**
	 * Returns the database client instance
	 */
	get client() {
		if (!this.db) {
			throw new LucidError({
				message: T("db_connection_error"),
			});
		}
		return this.db;
	}
}
