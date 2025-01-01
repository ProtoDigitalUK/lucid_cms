import queryBuilder, {
	type QueryBuilderWhere,
} from "../query-builder/index.js";
import z, { type ZodObject } from "zod";
import type { ServiceResponse } from "../../types.js";
import {
	sql,
	type ColumnDataType,
	type ReferenceExpression,
	type ComparisonOperatorExpression,
} from "kysely";
import type DatabaseAdapter from "../db/adapter.js";
import type { Select, Insert, Update, LucidDB, KyselyDB } from "../db/types.js";
import type { QueryParams } from "../../types/query-params.js";

/**
 * The base repository class that all repositories should extend. This class provides basic CRUD operations for a single table.
 *
 * For tables that need more complex queries with joins or subqueries. Its expect you override the methods in this class while keeping the same paramaters if posible.
 *
 * @todo Validation method to be added so we can validate the response data.
 * @todo Add logging for the queries along with execution time.
 * @todo Support for DB Adapters overiding queries. Probs best as a method that repos can opt into?
 * @todo Only implemented in the EmailsRepo class while testing it out. Will need to be fully implemented across all repositories.
 * @todo Add a solution for verifying if the Repos columnFormats are in sync with the database. This should be done via a test as opposed to runtime.
 */
abstract class BaseRepository<
	Table extends keyof LucidDB,
	T extends LucidDB[Table] = LucidDB[Table],
> {
	constructor(
		protected readonly db: KyselyDB,
		protected readonly dbAdapter: DatabaseAdapter,
		public readonly tableName: keyof LucidDB,
	) {}
	/**
	 * A Zod schema for the table.
	 */

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	protected abstract tableSchema: ZodObject<any>;
	/**
	 * The column data types for the table. Repositories need to keep these in sync with the migrations and the database.
	 */
	protected abstract columnFormats: Partial<Record<keyof T, ColumnDataType>>;
	/**
	 * The query configuration for the table. The main query builder fn uses this to map filter and sort query params to table columns, along with deciding which operators to use.
	 */
	protected abstract queryConfig?: {
		tableKeys?: {
			filters?: Record<string, ReferenceExpression<LucidDB, Table>>;
			sorts?: Record<string, ReferenceExpression<LucidDB, Table>>;
		};
		operators?: Record<string, ComparisonOperatorExpression | "%">;
	};

	/**
	 * Formats values that need special handling (like JSON or booleans)
	 * Leaves other values and column names unchanged
	 */
	protected formatData(data: Record<string, unknown>): Record<string, unknown> {
		const formatted: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(data)) {
			const columnType = this.columnFormats[key as keyof T];
			formatted[key] = columnType
				? this.dbAdapter.formatInsertValue(columnType, value)
				: value;
		}

		return formatted;
	}
	/**
	 * A helper that creates a partial zod schema based on selected columns.
	 */
	protected createSelectSchema<K extends keyof Select<T>>(select: K[]) {
		return this.tableSchema
			.pick(
				select.reduce<Record<string, true>>((acc, key) => {
					acc[key as string] = true;
					return acc;
				}, {}),
			)
			.partial();
	}
	/**
	 * Builds the schema based on selected/returned columns and the mode and validates the data against it.
	 * @todo Improve error message
	 */
	protected async validateResult<R, K extends keyof Select<T>>(props: {
		select: K[];
		mode: "single" | "multiple";
		data: R;
	}): ServiceResponse<R> {
		const selectSchema = this.createSelectSchema(props.select);
		const schema =
			props.mode === "single" ? selectSchema : z.array(selectSchema);

		const res = await schema.safeParseAsync(props.data);

		if (res.success) {
			return {
				data: props.data,
				error: undefined,
			};
		}

		return {
			data: undefined,
			error: {
				message: "error",
			},
		};
	}

	// ----------------------------------------
	// selects
	async selectSingle<K extends keyof Select<T>>(props: {
		select: K[];
		where: QueryBuilderWhere<Table>;
	}) {
		// @ts-expect-error
		let query = this.db.selectFrom(this.tableName).select(props.select);
		// @ts-expect-error
		query = queryBuilder.select(query, props.where);

		const data = (await query.executeTakeFirst()) as
			| Pick<Select<T>, K>
			| undefined;

		const validateRes = await this.validateResult({
			select: props.select,
			mode: "single",
			data: data,
		});
		return validateRes;
	}
	async selectMultiple<K extends keyof Select<T>>(props: {
		select: K[];
		where?: QueryBuilderWhere<Table>;
		orderBy?: { column: K; direction: "asc" | "desc" }[];
		limit?: number;
		offset?: number;
	}) {
		// @ts-expect-error
		let query = this.db.selectFrom(this.tableName).select(props.select);

		if (props.where) {
			// @ts-expect-error
			query = queryBuilder.select(query, props.where);
		}

		if (props.orderBy) {
			for (const order of props.orderBy) {
				query = query.orderBy(order.column as string, order.direction);
			}
		}

		if (props.limit) {
			query = query.limit(props.limit);
		}

		if (props.offset) {
			query = query.offset(props.offset);
		}

		return query.execute() as Promise<Pick<Select<T>, K>[]>;
	}
	async selectMultipleFiltered<K extends keyof Select<T>>(props: {
		select: K[];
		queryParams: Partial<QueryParams>;
	}) {
		// @ts-expect-error
		const emailsQuery = this.db.selectFrom(this.tableName).select(props.select);

		const emailsCountQuery = this.db
			.selectFrom(this.tableName)
			.select(sql`count(*)`.as("count"));

		const { main, count } = queryBuilder.main(
			{
				main: emailsQuery,
				count: emailsCountQuery,
			},
			{
				queryParams: props.queryParams,
				// @ts-expect-error
				meta: this.queryConfig,
			},
		);

		return Promise.all([
			main.execute() as Promise<Pick<Select<T>, K>[]>,
			count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
		]);
	}

	// ----------------------------------------
	// deletes
	async deleteSingle<K extends keyof Select<T>>(props: {
		returning?: K[];
		where: QueryBuilderWhere<Table>;
	}) {
		let query = this.db.deleteFrom(this.tableName);
		if (props.returning && props.returning.length > 0) {
			// @ts-expect-error
			query = query.returning(props.returning);
		}
		// @ts-expect-error
		query = queryBuilder.delete(query, props.where);
		return query.executeTakeFirst() as Promise<Pick<Select<T>, K> | undefined>;
	}
	async deleteMultiple<K extends keyof Select<T>>(props: {
		returning?: K[];
		where: QueryBuilderWhere<Table>;
	}) {
		let query = this.db.deleteFrom(this.tableName);
		if (props.returning && props.returning.length > 0) {
			// @ts-expect-error
			query = query.returning(props.returning);
		}
		// @ts-expect-error
		query = queryBuilder.delete(query, props.where);
		return query.execute() as Promise<Pick<Select<T>, K>[]>;
	}

	// ----------------------------------------
	// creates
	async createSingle<K extends keyof Select<T>>(props: {
		data: Partial<Insert<T>>;
		returning?: K[];
		returnAll?: boolean;
	}) {
		let query = this.db
			.insertInto(this.tableName)
			.values(this.formatData(props.data));
		if (
			props.returning &&
			props.returning.length > 0 &&
			props.returnAll !== true
		) {
			// @ts-expect-error
			query = query.returning(props.returning);
		}
		if (props.returnAll === true) {
			// @ts-expect-error
			query = query.returningAll();
		}
		return query.executeTakeFirst() as Promise<Pick<Select<T>, K> | undefined>;
	}
	async createMultiple<K extends keyof Select<T>>(props: {
		data: Partial<Insert<T>>[];
		returning?: K[];
		returnAll?: boolean;
	}) {
		let query = this.db
			.insertInto(this.tableName)
			.values(props.data.map(this.formatData));

		if (
			props.returning &&
			props.returning.length > 0 &&
			props.returnAll !== true
		) {
			// @ts-expect-error
			query = query.returning(props.returning);
		}
		if (props.returnAll === true) {
			// @ts-expect-error
			query = query.returningAll();
		}

		return query.execute() as Promise<Pick<Select<T>, K>[]>;
	}

	// ----------------------------------------
	// updates
	async updateSingle<K extends keyof Select<T>>(props: {
		data: Partial<Update<T>>;
		where: QueryBuilderWhere<Table>;
		returning?: K[];
		returnAll?: boolean;
	}) {
		let query = this.db
			.updateTable(this.tableName)
			.set(this.formatData(props.data));

		if (
			props.returning &&
			props.returning.length > 0 &&
			props.returnAll !== true
		) {
			// @ts-expect-error
			query = query.returning(props.returning);
		}
		if (props.returnAll === true) {
			// @ts-expect-error
			query = query.returningAll();
		}

		// @ts-expect-error
		query = queryBuilder.update(query, props.where);
		return query.executeTakeFirst() as Promise<Pick<Select<T>, K> | undefined>;
	}
}

export default BaseRepository;
