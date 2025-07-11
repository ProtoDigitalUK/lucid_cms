import T from "../translations/index.js";
import { PRESIGNED_URL_EXPIRY } from "../constants.js";
import type { AwsClient } from "aws4fetch";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyGetPresignedUrl } from "@lucidcms/core/types";

export default (client: AwsClient, pluginOptions: PluginOptions) => {
	const getPresignedUrl: MediaStrategyGetPresignedUrl = async (key, meta) => {
		try {
			const headers = new Headers();

			if (meta.mimeType) headers.set("Content-Type", meta.mimeType);
			if (meta.extension) headers.set("x-amz-meta-extension", meta.extension);

			const response = await client.sign(
				new Request(
					`${pluginOptions.endpoint}/${pluginOptions.bucket}/${key}?X-Amz-Expires=${PRESIGNED_URL_EXPIRY}`,
					{
						method: "PUT",
					},
				),
				{
					headers: headers,
					aws: { signQuery: true },
				},
			);

			return {
				error: undefined,
				data: {
					url: response.url.toString(),
					headers: Object.fromEntries(response.headers.entries()),
				},
			};
		} catch (e) {
			return {
				error: {
					type: "plugin",
					message:
						e instanceof Error ? e.message : T("an_unknown_error_occurred"),
				},
				data: undefined,
			};
		}
	};

	return getPresignedUrl;
};
