import T from "../../../translations/index.js";
import type { ServiceFn } from "../../../utils/services/types.js";

const checkCanUpdateMedia: ServiceFn<
	[
		{
			size: number;
			previousSize: number;
		},
	],
	{
		proposedSize: number;
	}
> = async (context, data) => {
	const maxFileSize = context.config.media?.maxFileSize;
	const storageLimit = context.config.media?.storageLimit;

	if (data.size > maxFileSize) {
		return {
			error: {
				type: "basic",
				message: T("file_too_large_max_size_is", {
					size: maxFileSize,
				}),
				status: 500,
				errors: {
					body: {
						file: {
							code: "storage",
							message: T("file_too_large_max_size_is", {
								size: maxFileSize,
							}),
						},
					},
				},
			},
			data: undefined,
		};
	}

	const storageUsedRes = await context.services.option.getSingle(context, {
		name: "media_storage_used",
	});
	if (storageUsedRes.error) return storageUsedRes;

	const proposedSize =
		(storageUsedRes.data.valueInt || 0) + data.size - data.previousSize;
	if (proposedSize > storageLimit) {
		return {
			error: {
				type: "basic",
				message: T("file_exceeds_storage_limit_max_limit_is", {
					size: storageLimit,
				}),
				status: 500,
				errors: {
					body: {
						file: {
							code: "storage",
							message: T("file_exceeds_storage_limit_max_limit_is", {
								size: storageLimit,
							}),
						},
					},
				},
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: {
			proposedSize: proposedSize,
		},
	};
};

export default checkCanUpdateMedia;
