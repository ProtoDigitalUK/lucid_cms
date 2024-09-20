import {
	mergeTranslationGroups,
	getUniqueLocaleCodes,
} from "../../utils/translations/index.js";
import Repository from "../../libs/repositories/index.js";
import type { BooleanInt } from "../../libs/db/types.js";
import type { ServiceFn } from "../../utils/services/types.js";

const createSingle: ServiceFn<
	[
		{
			key: string;
			fileName: string;
			title?: {
				localeCode: string;
				value: string | null;
			}[];
			alt?: {
				localeCode: string;
				value: string | null;
			}[];
			visible?: BooleanInt;
		},
	],
	number
> = async (context, data) => {
	const localeExistsRes =
		await context.services.locale.checks.checkLocalesExist(context, {
			localeCodes: getUniqueLocaleCodes([
				data.title || [],
				data.alt || [],
			]),
		});
	if (localeExistsRes.error) return localeExistsRes;

	const translationKeyIdsRes =
		await context.services.translation.createMultiple(context, {
			keys: ["title", "alt"],
			translations: mergeTranslationGroups([
				{
					translations: data.title || [],
					key: "title",
				},
				{
					translations: data.alt || [],
					key: "alt",
				},
			]),
		});
	if (translationKeyIdsRes.error) return translationKeyIdsRes;

	const syncMediaRes = await context.services.media.strategies.syncMedia(
		context,
		{
			key: data.key,
			fileName: data.fileName,
		},
	);
	if (syncMediaRes.error) return syncMediaRes;

	const MediaRepo = Repository.get("media", context.db);

	const mediaRes = await MediaRepo.createSingle({
		key: syncMediaRes.data.key,
		eTag: syncMediaRes.data.etag ?? undefined,
		visible: data.visible ?? 1,
		type: syncMediaRes.data.type,
		mimeType: syncMediaRes.data.mimeType,
		extension: syncMediaRes.data.extension,
		fileSize: syncMediaRes.data.size,
		width: syncMediaRes.data.width,
		height: syncMediaRes.data.height,
		titleTranslationKeyId: translationKeyIdsRes.data.title,
		altTranslationKeyId: translationKeyIdsRes.data.alt,
		blurHash: syncMediaRes.data.blurHash,
		averageColour: syncMediaRes.data.averageColour,
		isDark: syncMediaRes.data.isDark,
		isLight: syncMediaRes.data.isLight,
	});
	if (mediaRes === undefined) {
		await context.config.media?.strategy?.deleteSingle(
			syncMediaRes.data.key,
		);
		return {
			error: {
				type: "basic",
				status: 500,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: mediaRes.id,
	};
};

export default createSingle;
