import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../libs/services/types.js";

/*
    Periodically re-count the media storage usage.
*/

const updateMediaStorage: ServiceFn<[], undefined> = async (service) => {
	const MediaRepo = Repository.get("media", service.db);
	const ProcessedImagesRepo = Repository.get("processed-images", service.db);
	const OptionsRepo = Repository.get("options", service.db);

	const [mediaItems, processeddImagesItems] = await Promise.all([
		MediaRepo.selectMultiple({
			select: ["file_size"],
			where: [],
		}),
		ProcessedImagesRepo.selectMultiple({
			select: ["file_size"],
			where: [],
		}),
	]);

	const totlaMediaSize = mediaItems.reduce((acc, item) => {
		return acc + item.file_size;
	}, 0);
	const totalProcessedImagesSize = processeddImagesItems.reduce(
		(acc, item) => {
			return acc + item.file_size;
		},
		0,
	);

	await OptionsRepo.updateSingle({
		where: [
			{
				key: "name",
				operator: "=",
				value: "media_storage_used",
			},
		],
		data: {
			valueInt: totlaMediaSize + totalProcessedImagesSize,
		},
	});

	return {
		error: undefined,
		data: undefined,
	};
};

export default updateMediaStorage;