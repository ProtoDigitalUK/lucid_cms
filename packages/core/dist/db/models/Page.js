"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Page_slugUnique, _Page_checkParentNotHomepage, _Page_isParentSameCollection, _Page_resetHomepages;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const slugify_1 = __importDefault(require("slugify"));
const error_handler_1 = require("../../utils/error-handler");
const PageCategory_1 = __importDefault(require("../models/PageCategory"));
const Collection_1 = __importDefault(require("../models/Collection"));
const BrickData_1 = __importDefault(require("../models/BrickData"));
const format_page_1 = __importDefault(require("../../services/pages/format-page"));
const query_helpers_1 = require("../../utils/query-helpers");
class Page {
}
_a = Page;
Page.getMultiple = async (req) => {
    const { filter, sort, page, per_page } = req.query;
    const QueryB = new query_helpers_1.QueryBuilder({
        columns: [
            "id",
            "collection_key",
            "parent_id",
            "title",
            "slug",
            "full_slug",
            "homepage",
            "excerpt",
            "published",
            "published_at",
            "published_by",
            "created_by",
            "created_at",
            "updated_at",
        ],
        exclude: undefined,
        filter: {
            data: filter,
            meta: {
                collection_key: {
                    operator: "=",
                    type: "string",
                    columnType: "standard",
                },
                title: {
                    operator: "ILIKE",
                    type: "string",
                    columnType: "standard",
                },
                slug: {
                    operator: "ILIKE",
                    type: "string",
                    columnType: "standard",
                },
                category_id: {
                    operator: "=",
                    type: "int",
                    columnType: "standard",
                    table: "lucid_page_categories",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const { select, where, order, pagination } = QueryB.query;
    const pages = await db_1.default.query({
        text: `SELECT
          ${select},
          COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${where}
        GROUP BY lucid_pages.id
        ${order}
        ${pagination}`,
        values: QueryB.values,
    });
    const count = await db_1.default.query({
        text: `SELECT 
          COUNT(DISTINCT lucid_pages.id)
        FROM
          lucid_pages
        LEFT JOIN 
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${where}
        `,
        values: QueryB.countValues,
    });
    pages.rows.forEach((page) => {
        page = (0, format_page_1.default)(page);
    });
    return {
        data: pages.rows,
        count: count.rows[0].count,
    };
};
Page.getSingle = async (id, req) => {
    const { include } = req.query;
    const page = await db_1.default.query({
        text: `SELECT
          id,
          collection_key,
          parent_id,
          title,
          slug,
          full_slug,
          homepage,
          excerpt,
          published,
          published_at,
          published_by,
          created_by,
          created_at,
          updated_at
        FROM
          lucid_pages
        WHERE
          id = $1`,
        values: [id],
    });
    if (page.rows.length === 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page not found",
            message: `Page with id "${id}" not found`,
            status: 404,
        });
    }
    if (include && include.includes("bricks")) {
        const pageBricks = await BrickData_1.default.getAll("page", page.rows[0].id);
        page.rows[0].bricks = pageBricks;
    }
    return (0, format_page_1.default)(page.rows[0]);
};
Page.create = async (data, req) => {
    const parentId = data.homepage ? undefined : data.parent_id || undefined;
    const collectionFound = await Collection_1.default.findCollection(data.collection_key, "pages");
    if (!collectionFound) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Collection not found",
            message: `Collection with key "${data.collection_key}" and of type "pages" not found`,
            status: 404,
        });
    }
    await __classPrivateFieldGet(Page, _a, "f", _Page_checkParentNotHomepage).call(Page, data.parent_id || null);
    if (parentId) {
        await __classPrivateFieldGet(Page, _a, "f", _Page_isParentSameCollection).call(Page, parentId, data.collection_key);
    }
    const slug = await __classPrivateFieldGet(Page, _a, "f", _Page_slugUnique).call(Page, data.slug, data.homepage || false, parentId);
    const page = await db_1.default.query({
        text: `INSERT INTO lucid_pages (title, slug, homepage, collection_key, excerpt, published, parent_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        values: [
            data.title,
            slug,
            data.homepage || false,
            data.collection_key,
            data.excerpt || null,
            data.published || false,
            parentId,
            req.auth.id,
        ],
    });
    if (!page.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page Not Created",
            message: "There was an error creating the page",
            status: 500,
        });
    }
    if (data.category_ids) {
        await PageCategory_1.default.create({
            page_id: page.rows[0].id,
            category_ids: data.category_ids,
            collection_key: data.collection_key,
        });
    }
    if (data.homepage) {
        await __classPrivateFieldGet(Page, _a, "f", _Page_resetHomepages).call(Page, page.rows[0].id);
    }
    return (0, format_page_1.default)(page.rows[0]);
};
Page.update = async (id, data, req) => {
    const pageId = parseInt(id);
    const currentPageRes = await db_1.default.query({
        text: `SELECT
          id,
          parent_id,
          collection_key,
          title,
          slug,
          homepage,
          excerpt,
          published
        FROM
          lucid_pages
        WHERE
          id = $1`,
        values: [id],
    });
    const currentPage = currentPageRes.rows[0];
    if (!currentPage) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page not found",
            message: `Page with id "${id}" not found`,
            status: 404,
        });
    }
    const parentId = data.homepage ? undefined : data.parent_id || undefined;
    await __classPrivateFieldGet(Page, _a, "f", _Page_checkParentNotHomepage).call(Page, data.parent_id || null);
    if (parentId) {
        await __classPrivateFieldGet(Page, _a, "f", _Page_isParentSameCollection).call(Page, parentId, currentPage.collection_key);
    }
    let newSlug = undefined;
    if (data.slug) {
        newSlug = await __classPrivateFieldGet(Page, _a, "f", _Page_slugUnique).call(Page, data.slug, data.homepage || false, parentId);
    }
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)([
        "title",
        "slug",
        "excerpt",
        "published",
        "published_at",
        "published_by",
        "parent_id",
        "homepage",
    ], [
        data.title,
        newSlug,
        data.excerpt,
        data.published,
        data.published ? new Date() : null,
        data.published ? req.auth.id : null,
        parentId,
        data.homepage,
    ], {
        hasValues: {
            updated_at: new Date().toISOString(),
        },
    });
    const page = await db_1.default.query({
        text: `UPDATE lucid_pages SET ${columns.formatted.update} WHERE id = $${aliases.value.length + 1} RETURNING *`,
        values: [...values.value, pageId],
    });
    if (!page.rows[0]) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page Not Updated",
            message: "There was an error updating the page",
            status: 500,
        });
    }
    const brickPromises = data.bricks?.map((brick, index) => BrickData_1.default.createOrUpdate(brick, index, "page", pageId)) || [];
    const pageBricksIds = await Promise.all(brickPromises);
    if (data.bricks) {
        await BrickData_1.default.deleteUnused("page", pageId, pageBricksIds);
    }
    return (0, format_page_1.default)(page.rows[0]);
};
_Page_slugUnique = { value: async (slug, homepage, parent_id) => {
        if (homepage) {
            return "/";
        }
        slug = (0, slugify_1.default)(slug, { lower: true, strict: true });
        const values = [slug];
        if (parent_id)
            values.push(parent_id);
        const slugCount = await db_1.default.query({
            text: `SELECT COUNT(*) FROM lucid_pages WHERE slug ~ '^${slug}-\\d+$' OR slug = $1 ${parent_id ? `AND parent_id = $2` : `AND parent_id IS NULL`}`,
            values: values,
        });
        if (slugCount.rows[0].count >= 1) {
            return `${slug}-${slugCount.rows[0].count}`;
        }
        else {
            return slug;
        }
    } };
_Page_checkParentNotHomepage = { value: async (parent_id) => {
        if (!parent_id)
            return;
        const values = [];
        if (parent_id)
            values.push(parent_id);
        const parent = await db_1.default.query({
            text: `SELECT homepage FROM lucid_pages ${parent_id ? `WHERE id = $1` : `WHERE parent_id IS NULL`}`,
            values: values,
        });
        if (parent.rows[0].homepage) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Homepage Parent",
                message: "The homepage cannot be set as a parent!",
                status: 400,
            });
        }
    } };
_Page_isParentSameCollection = { value: async (parent_id, collection_key) => {
        const parent = await db_1.default.query({
            text: `SELECT collection_key FROM lucid_pages WHERE id = $1`,
            values: [parent_id],
        });
        if (parent.rows[0].collection_key !== collection_key) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Parent Collection Mismatch",
                message: "The parent page must be in the same collection as the page you are creating!",
                status: 400,
            });
        }
    } };
_Page_resetHomepages = { value: async (current) => {
        const result = await db_1.default.query({
            text: `SELECT id, title FROM lucid_pages WHERE homepage = true AND id != $1`,
            values: [current],
        });
        for (const row of result.rows) {
            let newSlug = (0, slugify_1.default)(row.title, { lower: true, strict: true });
            const slugExists = await db_1.default.query({
                text: `SELECT COUNT(*) FROM lucid_pages WHERE slug = $1 AND id != $2`,
                values: [newSlug, row.id],
            });
            if (slugExists.rows[0].count > 0) {
                newSlug += `-${row.id}`;
            }
            await db_1.default.query({
                text: `UPDATE lucid_pages SET homepage = false, parent_id = null, slug = $2 WHERE id = $1`,
                values: [row.id, newSlug],
            });
        }
    } };
exports.default = Page;
//# sourceMappingURL=Page.js.map