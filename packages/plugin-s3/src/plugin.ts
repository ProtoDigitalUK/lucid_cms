import type { HeadlessPluginOptions } from "@protodigital/headless";
import type { PluginOptions } from "./types/types.js";
import getS3Client from "./s3-client.js";
import stream from "./services/steam.js";
import deletSingle from "./services/delete-single.js";
import deleteMultiple from "./services/delete-multiple.js";
import updateSingle from "./services/update-single.js";
import uploadSingle from "./services/upload-single.js";

const plugin: HeadlessPluginOptions<PluginOptions> = (
	config,
	pluginOptions,
) => {
	const client = getS3Client(pluginOptions);

	config.media = {
		...config.media,
		stategy: {
			stream: stream(client, pluginOptions),
			uploadSingle: uploadSingle(client, pluginOptions),
			updateSingle: updateSingle(client, pluginOptions),
			deleteSingle: deletSingle(client, pluginOptions),
			deleteMultiple: deleteMultiple(client, pluginOptions),
		},
	};
	return config;
};

export default plugin;
