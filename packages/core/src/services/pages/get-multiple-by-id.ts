import { PoolClient } from "pg";
// Models
import Page from "@db/models/Page.js";

export interface ServiceData {
  ids: Array<number>;
  environment_key: string;
}

const getMultipleById = async (client: PoolClient, data: ServiceData) => {
  const pages = await Page.getMultipleByIds(client, {
    ids: data.ids,
    environment_key: data.environment_key,
  });

  return pages;
};

export default getMultipleById;
