import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
// Models
import Media from "@db/models/Media.js";
// Format
import formatMedia from "@utils/format/format-media.js";

export interface ServiceData {
  id: number;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  const media = await Media.getSingleById(client, {
    id: data.id,
  });

  if (!media) {
    throw new LucidError({
      type: "basic",
      name: "Media not found",
      message: "We couldn't find the media you were looking for.",
      status: 404,
    });
  }

  return formatMedia(media);
};

export default getSingle;
