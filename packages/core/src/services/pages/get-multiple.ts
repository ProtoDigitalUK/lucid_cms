import z from "zod";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers";
// Models
import Page from "@db/models/Page";
// Schema
import pagesSchema from "@schemas/pages";
// Format
import formatPage from "@utils/format/format-page";

export interface ServiceData {
  query: z.infer<typeof pagesSchema.getMultiple.query>;
  environment_key: string;
}

const getMultiple = async (data: ServiceData) => {
  const { filter, sort, page, per_page } = data.query;

  // Build Query Data and Query
  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "environment_key",
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
      data: {
        ...filter,
        environment_key: data.environment_key,
      },
      meta: {
        collection_key: {
          operator: "=",
          type: "text",
          columnType: "standard",
        },
        title: {
          operator: "%",
          type: "text",
          columnType: "standard",
        },
        slug: {
          operator: "%",
          type: "text",
          columnType: "standard",
        },
        category_id: {
          operator: "=",
          type: "int",
          columnType: "standard",
          table: "lucid_page_categories",
        },
        environment_key: {
          operator: "=",
          type: "text",
          columnType: "standard",
        },
      },
    },
    sort: sort,
    page: page,
    per_page: per_page,
  });

  const pages = await Page.getMultiple(SelectQuery);

  return {
    data: pages.data.map((page) => formatPage(page)),
    count: pages.count,
  };
};

export default getMultiple;
