import client from "@db/db";
import { Request, query } from "express";
import { LucidError } from "@utils/error-handler";
// Models
import { CategoryT } from "@db/models/Category";
import PageCategory from "./PageCategory";
// Serivces
import QueryBuilder from "@services/models/QueryBuilder";

// -------------------------------------------
// Types
interface QueryParamsGetMultiple extends ModelQueryParams {
  filter?: {
    post_type_id?: string;
    title?: string;
    slug?: string;
    category_id?: string | Array<string>;
  };
  sort?: Array<{
    key: "created_at";
    value: "asc" | "desc";
  }>;
  page?: string;
  per_page?: string;
}

type PageGetMultiple = (req: Request) => Promise<{
  data: PageT[];
  count: number;
}>;

type PageCreate = (
  req: Request,
  data: {
    title: string;
    slug: string;
    post_type_id: number;
    homepage?: boolean;
    excerpt?: string;
    published?: boolean;
    parent_id?: number;
    category_ids?: Array<number>;
  }
) => Promise<PageT>;

// -------------------------------------------
// User
export type PageT = {
  id: number;
  post_type_id: number;
  parent_id: number | null;

  title: string;
  slug: string;
  full_slug: string;
  homepage: boolean;
  excerpt: string | null;
  categories?: Array<CategoryT>;

  published: boolean;
  published_at: string | null;
  published_by: number | null;

  created_by: number | null;
  created_at: string;
  updated_at: string;
};

export default class Page {
  // -------------------------------------------
  // Methods
  static getMultiple: PageGetMultiple = async (req) => {
    const { filter, sort, page, per_page } =
      req.query as QueryParamsGetMultiple;

    // Build Query Data and Query
    const QueryB = new QueryBuilder({
      columns: [
        "id",
        "post_type_id",
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
          post_type_id: {
            operator: "=",
            type: "int",
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

    // Get Pages
    // TODO: add join for post_type
    // TODO: add join for bricks
    const pages = await client.query<PageT>({
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

    const count = await client.query<{ count: number }>({
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

    return {
      data: pages.rows,
      count: count.rows[0].count,
    };
  };
  static create: PageCreate = async (req, data) => {
    // Check if the the parent_id is the homepage
    await Page.checkParentNotHomepage(data.parent_id || null);

    // Set parent id to null if homepage as homepage has to be root level
    const parentId = data.homepage ? null : data.parent_id || null;
    // Check if the parent is the same page type
    if (parentId) await Page.checkParentIsSameType(parentId, data.post_type_id);
    // Check if slug is unique
    const slug = await Page.slugUnique(data.slug, parentId);
    // Generate full slug
    const fullSlug = await Page.computeFullSlug(
      slug,
      parentId,
      data.homepage || false
    );

    // Create page
    const page = await client.query<PageT>({
      text: `INSERT INTO lucid_pages (title, slug, full_slug, homepage, post_type_id, excerpt, published, parent_id, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      values: [
        data.title,
        slug,
        fullSlug,
        data.homepage || false,
        data.post_type_id,
        data.excerpt || null,
        data.published || false,
        parentId,
        req.auth.id,
      ],
    });

    if (!page.rows[0]) {
      throw new LucidError({
        type: "basic",
        name: "Page Not Created",
        message: "There was an error creating the page",
        status: 500,
      });
    }

    if (data.category_ids) {
      await PageCategory.create({
        page_id: page.rows[0].id,
        category_ids: data.category_ids,
        post_type_id: data.post_type_id,
      });
    }

    // TODO: Add bricks via brick model

    // Reset homepages
    if (data.homepage) {
      await Page.resetHomepages(page.rows[0].id);
    }

    return page.rows[0];
  };
  // -------------------------------------------
  // Util Methods
  static slugUnique = async (slug: string, parent_id: number | null) => {
    const values: Array<any> = [slug];
    if (parent_id) values.push(parent_id);
    const slugCount = await client.query<{ count: number }>({
      // where slug is like, slug-example, slug-example-1, slug-example-2
      text: `SELECT COUNT(*) FROM lucid_pages WHERE slug ~ '^${slug}-\\d+$' OR slug = $1 ${
        parent_id ? `AND parent_id = $2` : `AND parent_id IS NULL`
      }`,
      values: values,
    });
    if (slugCount.rows[0].count >= 1)
      return `${slug}-${slugCount.rows[0].count}`;
    return slug;
  };
  static checkParentNotHomepage = async (parent_id: number | null) => {
    if (!parent_id) return;
    const values: Array<any> = [];
    if (parent_id) values.push(parent_id);

    const parent = await client.query<{ homepage: boolean }>({
      text: `SELECT homepage FROM lucid_pages ${
        parent_id ? `WHERE id = $1` : `WHERE parent_id IS NULL`
      }`,
      values: values,
    });
    if (parent.rows[0].homepage) {
      throw new LucidError({
        type: "basic",
        name: "Homepage Parent",
        message: "The homepage cannot be set as a parent!",
        status: 400,
      });
    }
  };
  static checkParentIsSameType = async (
    parent_id: number,
    post_type_id: number
  ) => {
    const parent = await client.query<{ post_type_id: number }>({
      text: `SELECT post_type_id FROM lucid_pages WHERE id = $1`,
      values: [parent_id],
    });

    if (parent.rows[0].post_type_id !== post_type_id) {
      throw new LucidError({
        type: "basic",
        name: "Parent Type Mismatch",
        message:
          "The parent page must be the same page type as the page you are creating!",
        status: 400,
      });
    }
  };
  static resetHomepages = async (current: number) => {
    // reset homepage, set its parent to null and its full slug to its slug
    await client.query({
      text: `UPDATE lucid_pages SET homepage = false, parent_id = null, full_slug = \'/\' || slug WHERE homepage = true AND id != $1`,
      values: [current],
    });
  };
  static computeFullSlug = async (
    slug: string,
    parent_id: number | null,
    homepage: boolean
  ) => {
    if (homepage) return "/";
    if (!parent_id) return `/${slug}`;

    let fullSlug = "";

    // recursivly get parent slugs
    const getParent = async (id: number) => {
      const parent = await client.query<{ slug: string; parent_id: number }>({
        text: `SELECT slug, parent_id FROM lucid_pages WHERE id = $1`,
        values: [id],
      });
      if (parent.rows[0].parent_id) {
        await getParent(parent.rows[0].parent_id);
      }
      fullSlug = `${parent.rows[0].slug}/${fullSlug}`;
    };
    await getParent(parent_id);

    return `/${fullSlug}${slug}`;
  };
}