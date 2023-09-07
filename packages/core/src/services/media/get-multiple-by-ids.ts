import { PoolClient } from "pg";
// Models
import Media from "@db/models/Media.js";
// Format
import formatMedia from "@utils/format/format-media.js";

export interface ServiceData {
  ids: number[];
}

const getMultipleByIds = async (client: PoolClient, data: ServiceData) => {
  const mediasRes = await Media.getMultipleByIds(client, {
    ids: data.ids,
  });

  if (!mediasRes) {
    return [];
  }

  return mediasRes.map((media) => formatMedia(media));
};

export default getMultipleByIds;
