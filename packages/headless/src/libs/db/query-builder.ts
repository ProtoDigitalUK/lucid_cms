import type { RequestQueryParsedT } from "../../middleware/validate-query.js";
import type {
	SelectQueryBuilder,
	ReferenceExpression,
	ComparisonOperatorExpression,
	DeleteQueryBuilder,
	OperandValueExpressionOrList,
	UpdateQueryBuilder,
} from "kysely";
import type { CollectionFiltersResT } from "../../utils/field-helpers.js";
import type { HeadlessDB } from "./types.js";

export interface QueryBuilderConfigT<DB, Table extends keyof DB> {
	requestQuery: RequestQueryParsedT;
	meta: {
		filters: {
			queryKey: string; // e.g. "filter[status]" - the object key for the specific filter
			tableKey: ReferenceExpression<DB, Table>; // e.g. "status" - the table column name for the specific filter
			operator: ComparisonOperatorExpression | "%";
		}[];
		sorts: {
			queryKey: string;
			tableKey: ReferenceExpression<DB, Table>;
		}[];
		collectionFilters?: CollectionFiltersResT[];
	};
}

const queryBuilder = <DB, Table extends keyof DB, O, T>(
	db: {
		main: SelectQueryBuilder<DB, Table, O>;
		count?: SelectQueryBuilder<
			DB,
			Table,
			{
				count: unknown;
			}
		>;
	},
	config: QueryBuilderConfigT<DB, Table>,
) => {
	let mainQuery = db.main;
	let countQuery = db.count;
	const { requestQuery, meta } = config;

	// -----------------------------------------
	// Filters
	const filters = Object.entries(requestQuery.filter || {});
	for (const [queryKey, value] of filters) {
		const filterMeta = meta.filters.find(
			(filter) => filter.queryKey === queryKey,
		);
		if (!filterMeta) continue;

		const { tableKey, operator } = filterMeta;

		const isArray = Array.isArray(value);

		if (isArray) {
			mainQuery = mainQuery.where(tableKey, "in", value);
			if (countQuery) {
				countQuery = countQuery.where(tableKey, "in", value);
			}
		} else {
			mainQuery = mainQuery.where(
				tableKey,
				operator as ComparisonOperatorExpression,
				value,
			);
			if (countQuery) {
				countQuery = countQuery.where(
					tableKey,
					operator as ComparisonOperatorExpression,
					value,
				);
			}
		}
	}

	// collection filters
	if (
		config.meta.collectionFilters &&
		config.meta.collectionFilters.length > 0
	) {
		for (const { key, value, column } of config.meta.collectionFilters) {
			mainQuery = mainQuery.where(({ eb, and }) =>
				and([
					// @ts-expect-error
					eb("headless_collection_document_fields.key", "=", key),
					eb(
						// @ts-expect-error
						`headless_collection_document_fields.${column}`,
						Array.isArray(value) ? "in" : "=",
						value,
					),
				]),
			);
			if (countQuery) {
				countQuery = countQuery.where(({ eb, and }) =>
					and([
						// @ts-expect-error
						eb("headless_collection_document_fields.key", "=", key),
						eb(
							// @ts-expect-error
							`headless_collection_document_fields.${column}`,
							Array.isArray(value) ? "in" : "=",
							value,
						),
					]),
				);
			}
		}
	}

	// -----------------------------------------
	// Sort
	if (requestQuery.sort) {
		for (const sort of requestQuery.sort) {
			const sortMeta = meta.sorts.find(
				(sortMeta) => sortMeta.queryKey === sort.key,
			);
			if (!sortMeta) continue;

			const { tableKey } = sortMeta;

			mainQuery = mainQuery.orderBy(tableKey, sort.value);
		}
	}

	// -----------------------------------------
	// Pagination

	if (requestQuery.perPage !== -1) {
		mainQuery = mainQuery
			.limit(requestQuery.perPage)
			.offset((requestQuery.page - 1) * requestQuery.perPage);
	}

	return {
		main: mainQuery,
		count: countQuery,
	};
};

export type QueryBuilderWhereT<Table extends keyof HeadlessDB> = Array<{
	key: ReferenceExpression<HeadlessDB, Table>;
	operator: ComparisonOperatorExpression;
	value: OperandValueExpressionOrList<HeadlessDB, Table, keyof Table>;
}>;

export const selectQB = <Table extends keyof HeadlessDB, O>(
	query: SelectQueryBuilder<HeadlessDB, Table, O>,
	where: QueryBuilderWhereT<Table>,
) => {
	let kyselyQuery = query;

	for (const { key, operator, value } of where) {
		kyselyQuery = kyselyQuery.where(key, operator, value);
	}

	return kyselyQuery;
};

export const deleteQB = <Table extends keyof HeadlessDB, O>(
	query: DeleteQueryBuilder<HeadlessDB, Table, O>,
	where: QueryBuilderWhereT<Table>,
) => {
	let kyselyQuery = query;

	for (const { key, operator, value } of where) {
		kyselyQuery = kyselyQuery.where(key, operator, value);
	}

	return kyselyQuery;
};

export const updateQB = <
	UT extends keyof HeadlessDB,
	Table extends keyof HeadlessDB,
	O,
>(
	query: UpdateQueryBuilder<HeadlessDB, UT, Table, O>,
	where: QueryBuilderWhereT<Table>,
) => {
	let kyselyQuery = query;

	for (const { key, operator, value } of where) {
		kyselyQuery = kyselyQuery.where(key, operator, value);
	}

	return kyselyQuery;
};

export default queryBuilder;
