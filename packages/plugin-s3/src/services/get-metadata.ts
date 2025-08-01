import T from "../translations/index.js";
import type { AwsClient } from "aws4fetch";
import type { PluginOptions } from "../types/types.js";
import type { MediaStrategyGetMeta } from "@lucidcms/core/types";

export default (client: AwsClient, pluginOptions: PluginOptions) => {
	const getMetadata: MediaStrategyGetMeta = async (key) => {
		try {
			const response = await client.sign(
				new Request(
					`${pluginOptions.endpoint}/${pluginOptions.bucket}/${key}`,
					{
						method: "HEAD",
					},
				),
			);

			const result = await fetch(response);

			if (!result.ok) {
				return {
					error: {
						type: "plugin",
						message: T("get_metadata_failed", {
							status: result.status,
							statusText: result.statusText,
						}),
					},
					data: undefined,
				};
			}

			const contentLength = result.headers.get("content-length");

			if (!contentLength) {
				return {
					error: {
						message: T("object_missing_metadata"),
					},
					data: undefined,
				};
			}

			const contentType = result.headers.get("content-type");
			const etag = result.headers.get("etag");

			return {
				error: undefined,
				data: {
					size: Number.parseInt(contentLength, 10),
					mimeType: contentType || null,
					etag: etag || null,
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
	return getMetadata;
};
