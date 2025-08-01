import Formatter from "./index.js";
import { createMediaUrl } from "../../utils/media/index.js";
import type { BooleanInt } from "../../libs/db/types.js";
import type { MediaResponse, MediaType } from "../../types/response.js";
import type { Config, UrlStrategy } from "../../types/config.js";

export interface MediaPropsT {
	id: number;
	key: string;
	e_tag: string | null;
	type: string;
	mime_type: string;
	file_extension: string;
	file_size: number;
	width: number | null;
	height: number | null;
	title_translation_key_id: number | null;
	alt_translation_key_id: number | null;
	created_at: Date | string | null;
	updated_at: Date | string | null;
	blur_hash: string | null;
	average_colour: string | null;
	is_dark: BooleanInt | null;
	is_light: BooleanInt | null;
	title_translations?: Array<{
		value: string | null;
		locale_code: string | null;
	}>;
	alt_translations?: Array<{
		value: string | null;
		locale_code: string | null;
	}>;
	title_translation_value?: string | null;
	alt_translation_value?: string | null;
}

export default class MediaFormatter {
	formatMultiple = (props: {
		media: MediaPropsT[];
		host: string;
		urlStrategy: UrlStrategy | undefined;
	}) => {
		return props.media.map((m) =>
			this.formatSingle({
				media: m,
				host: props.host,
				urlStrategy: props.urlStrategy,
			}),
		);
	};
	formatSingle = (props: {
		media: MediaPropsT;
		host: string;
		urlStrategy: UrlStrategy | undefined;
	}): MediaResponse => {
		return {
			id: props.media.id,
			key: props.media.key,
			url: createMediaUrl({
				key: props.media.key,
				host: props.host,
				urlStrategy: props.urlStrategy,
			}),
			title:
				props.media.title_translations?.map((t) => ({
					value: t.value,
					localeCode: t.locale_code,
				})) ?? [],
			alt:
				props.media.alt_translations?.map((t) => ({
					value: t.value,
					localeCode: t.locale_code,
				})) ?? [],
			type: props.media.type as MediaType,
			meta: {
				mimeType: props.media.mime_type,
				extension: props.media.file_extension,
				fileSize: props.media.file_size,
				width: props.media.width,
				height: props.media.height,
				blurHash: props.media.blur_hash,
				averageColour: props.media.average_colour,
				isDark: Formatter.formatBoolean(props.media.is_dark),
				isLight: Formatter.formatBoolean(props.media.is_light),
			},
			createdAt: Formatter.formatDate(props.media.created_at),
			updatedAt: Formatter.formatDate(props.media.updated_at),
		};
	};
}
