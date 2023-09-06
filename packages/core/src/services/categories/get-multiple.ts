import { PoolClient } from "pg";
import z from "zod";
// Models
import Category from "@db/models/Category.js";
// Schema
import categorySchema from "@schemas/categories.js";
// Utils
import { SelectQueryBuilder } from "@utils/app/query-helpers.js";

export interface ServiceData {
  environment_key: string;
  query: z.infer<typeof categorySchema.getMultiple.query>;
}

const getMultiple = async (client: PoolClient, data: ServiceData) => {
  const { filter, sort, page, per_page } = data.query;

  const SelectQuery = new SelectQueryBuilder({
    columns: [
      "id",
      "environment_key",
      "collection_key",
      "title",
      "slug",
      "description",
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

  return await Category.getMultiple(client, SelectQuery);
};

export default getMultiple;
