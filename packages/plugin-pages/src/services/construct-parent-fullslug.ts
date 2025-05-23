import buildFullSlug from "../utils/build-fullslug-from-fullslug.js";
import type {
	Config,
	FieldInputSchema,
	ServiceResponse,
} from "@lucidcms/core/types";
import type { CollectionConfig } from "../types/index.js";
import type { ParentPageQueryResponse } from "./get-parent-fields.js";

/**
 *  Constructs the fullSlug from the slug and parentPage fields
 */
const constructParentFullSlug = (data: {
	collection: CollectionConfig;
	parentFields: Array<ParentPageQueryResponse>;
	localisation: Config["localisation"];
	fields: {
		slug: FieldInputSchema;
	};
}): Awaited<ServiceResponse<Record<string, string | null>>> => {
	// initialise fullSlug with null values for each locale
	const fullSlug: Record<string, string | null> =
		data.localisation.locales.reduce<Record<string, string | null>>(
			(acc, locale) => {
				acc[locale.code] = null;
				return acc;
			},
			{},
		);

	// if translations are enabled/set
	if (data.collection.useTranslations && data.fields.slug.translations) {
		for (let i = 0; i < data.localisation.locales.length; i++) {
			const locale = data.localisation.locales[i];
			if (!locale) continue;

			fullSlug[locale.code] = buildFullSlug({
				parentFields: data.parentFields || [],
				targetLocale: locale.code,
				slug: data.fields.slug.translations[locale.code],
			});
		}
	} else {
		fullSlug[data.localisation.defaultLocale] = buildFullSlug({
			parentFields: data.parentFields || [],
			targetLocale: data.localisation.defaultLocale,
			slug: data.fields.slug.value,
		});
	}

	return {
		error: undefined,
		data: fullSlug,
	};
};

export default constructParentFullSlug;
