import getDBClient from "@db/db";
// Models
import { BrickObject } from "@db/models/CollectionBrick";
// Utils
import { queryDataFormat, SelectQueryBuilder } from "@utils/app/query-helpers";
// Format
import { BrickResT } from "@utils/format/format-bricks";

// -------------------------------------------
// Types
type PageGetMultiple = (query_instance: SelectQueryBuilder) => Promise<{
  data: PageT[];
  count: number;
}>;

type PageGetSingle = (query_instance: SelectQueryBuilder) => Promise<PageT>;

type PageGetSingleBasic = (
  id: number,
  environment_key: string
) => Promise<PageT>;

type PageGetSlugCount = (data: {
  slug: string;
  environment_key: string;
  collection_key: string;
  parent_id?: number;
}) => Promise<number>;

type PageCreateSingle = (data: {
  userId: number;
  environment_key: string;
  title: string;
  slug: string;
  collection_key: string;
  homepage?: boolean;
  excerpt?: string;
  published?: boolean;
  parent_id?: number;
  category_ids?: Array<number>;
}) => Promise<PageT>;

type PageUpdateSingle = (data: {
  id: number;
  environment_key: string;
  userId: number;

  title?: string;
  slug?: string;
  homepage?: boolean;
  parent_id?: number;
  category_ids?: Array<number>;
  published?: boolean;
  excerpt?: string;
  builder_bricks?: Array<BrickObject>;
  fixed_bricks?: Array<BrickObject>;
}) => Promise<PageT>;

type PageDeleteSingle = (data: { id: number }) => Promise<PageT>;

type PageGetMultipleByIds = (data: {
  ids: Array<number>;
  environment_key: string;
}) => Promise<PageT[]>;

// -------------------------------------------
// User
export type PageT = {
  id: number;
  environment_key: string;
  parent_id: number | null;
  collection_key: string;

  title: string;
  slug: string;
  full_slug: string;
  homepage: boolean;
  excerpt: string | null;
  categories?: Array<number> | null;

  builder_bricks?: Array<BrickResT> | null;
  fixed_bricks?: Array<BrickResT> | null;

  published: boolean;
  published_at: string | null;
  published_by: number | null;

  created_by: number | null;
  created_at: string;
  updated_at: string;
};

export default class Page {
  // -------------------------------------------
  // Functions
  static getMultiple: PageGetMultiple = async (query_instance) => {
    const client = await getDBClient;

    const pages = client.query<PageT>({
      text: `SELECT
          ${query_instance.query.select},
          COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${query_instance.query.where}
        GROUP BY lucid_pages.id
        ${query_instance.query.order}
        ${query_instance.query.pagination}`,
      values: query_instance.values,
    });

    const count = client.query<{ count: number }>({
      text: `SELECT 
          COUNT(DISTINCT lucid_pages.id)
        FROM
          lucid_pages
        LEFT JOIN 
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${query_instance.query.where}
        `,
      values: query_instance.countValues,
    });

    const data = await Promise.all([pages, count]);

    return {
      data: data[0].rows,
      count: data[1].rows[0].count,
    };
  };
  static getSingle: PageGetSingle = async (query_instance) => {
    const client = await getDBClient;

    const page = await client.query<PageT>({
      text: `SELECT
        ${query_instance.query.select},
        COALESCE(json_agg(lucid_page_categories.category_id), '[]') AS categories
        FROM
          lucid_pages
        LEFT JOIN
          lucid_page_categories ON lucid_page_categories.page_id = lucid_pages.id
        ${query_instance.query.where}
        GROUP BY lucid_pages.id`,
      values: query_instance.values,
    });

    return page.rows[0];
  };
  static createSingle: PageCreateSingle = async (data) => {
    const client = await getDBClient;

    const page = await client.query<PageT>({
      text: `INSERT INTO lucid_pages (environment_key, title, slug, homepage, collection_key, excerpt, published, parent_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      values: [
        data.environment_key,
        data.title,
        data.slug,
        data.homepage || false,
        data.collection_key,
        data.excerpt || null,
        data.published || false,
        data.parent_id,
        data.userId,
      ],
    });

    return page.rows[0];
  };
  static updateSingle: PageUpdateSingle = async (data) => {
    const client = await getDBClient;

    const { columns, aliases, values } = queryDataFormat({
      columns: [
        "title",
        "slug",
        "excerpt",
        "published",
        "published_at",
        "published_by",
        "parent_id",
        "homepage",
      ],
      values: [
        data.title,
        data.slug,
        data.excerpt,
        data.published,
        data.published ? new Date() : null,
        data.published ? data.userId : null,
        data.parent_id,
        data.homepage,
      ],
      conditional: {
        hasValues: {
          updated_at: new Date().toISOString(),
        },
      },
    });

    // -------------------------------------------
    // Update page
    const page = await client.query<PageT>({
      text: `UPDATE lucid_pages SET ${columns.formatted.update} WHERE id = $${
        aliases.value.length + 1
      } RETURNING *`,
      values: [...values.value, data.id],
    });

    return page.rows[0];
  };
  static deleteSingle: PageDeleteSingle = async (data) => {
    const client = await getDBClient;

    const page = await client.query<PageT>({
      text: `DELETE FROM lucid_pages WHERE id = $1 RETURNING *`,
      values: [data.id],
    });

    return page.rows[0];
  };
  static getMultipleByIds: PageGetMultipleByIds = async (data) => {
    const client = await getDBClient;

    const pages = await client.query<PageT>({
      text: `SELECT * FROM lucid_pages WHERE id = ANY($1) AND environment_key = $2`,
      values: [data.ids, data.environment_key],
    });

    return pages.rows;
  };
  // -------------------------------------------
  // new
  static getSingleBasic: PageGetSingleBasic = async (id, environment_key) => {
    const client = await getDBClient;

    const page = await client.query<PageT>({
      text: `SELECT
          *
        FROM
          lucid_pages
        WHERE
          id = $1
        AND
          environment_key = $2`,
      values: [id, environment_key],
    });

    return page.rows[0];
  };
  static getSlugCount: PageGetSlugCount = async (data) => {
    const client = await getDBClient;

    const values: Array<any> = [
      data.slug,
      data.collection_key,
      data.environment_key,
    ];
    if (data.parent_id) values.push(data.parent_id);

    const slugCount = await client.query<{ count: number }>({
      // where slug is like, slug-example, slug-example-1, slug-example-2
      text: `SELECT COUNT(*) 
        FROM 
          lucid_pages 
        WHERE slug ~ '^${data.slug}-\\d+$' 
        OR 
          slug = $1
        AND
          collection_key = $2
        AND
          environment_key = $3
        ${data.parent_id ? `AND parent_id = $4` : `AND parent_id IS NULL`}`,
      values: values,
    });

    return slugCount.rows[0].count;
  };
  static getNonCurrentHomepages = async (
    currentId: number,
    environment_key: string
  ) => {
    const client = await getDBClient;
    const result = await client.query({
      text: `SELECT id, title FROM lucid_pages WHERE homepage = true AND id != $1 AND environment_key = $2`,
      values: [currentId, environment_key],
    });
    return result.rows;
  };
  static checkSlugExistence = async (
    slug: string,
    id: number,
    environment_key: string
  ) => {
    const client = await getDBClient;
    const slugExists = await client.query({
      text: `SELECT COUNT(*) FROM lucid_pages WHERE slug = $1 AND id != $2 AND environment_key = $3`,
      values: [slug, id, environment_key],
    });
    return slugExists.rows[0].count > 0;
  };
  static updatePageToNonHomepage = async (id: number, newSlug: string) => {
    const client = await getDBClient;
    await client.query({
      text: `UPDATE lucid_pages SET homepage = false, parent_id = null, slug = $2 WHERE id = $1`,
      values: [id, newSlug],
    });
  };
}
