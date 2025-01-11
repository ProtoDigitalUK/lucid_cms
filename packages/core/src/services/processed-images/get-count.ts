import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceFn } from "../../utils/services/types.js";

const getCount: ServiceFn<[], number> = async (context) => {
	const ProcessedImages = Repository.get(
		"processed-images",
		context.db,
		context.config.db,
	);

	const processedImageCountRes = await ProcessedImages.count({
		validation: { enabled: true },
	});
	if (processedImageCountRes.error) return processedImageCountRes;

	return {
		error: undefined,
		data: Formatter.parseCount(processedImageCountRes.data?.count),
	};
};

export default getCount;
