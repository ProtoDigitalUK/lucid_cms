import type C from "../constants/constants.js";

export type SupportedLocales = (typeof C.locales)[number];
export type LocaleValue = Record<SupportedLocales, string> | string;

export interface TranslationsObj {
	localeCode: string;
	value: string | null;
}
