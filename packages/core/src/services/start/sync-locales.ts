import Repository from "../../libs/repositories/index.js";
import constants from "../../constants/constants.js";
import Formatter from "../../libs/formatters/index.js";
import logger from "../../utils/logging/index.js";
import type { ServiceContext, ServiceFn } from "../../utils/services/types.js";

const syncLocales: ServiceFn<[], undefined> = async (
	context: ServiceContext,
) => {
	// Responsible for syncing locales config with the database
	const LocalesRepo = Repository.get("locales", context.db, context.config.db);
	const localeCodes = context.config.localisation.locales.map(
		(locale) => locale.code,
	);

	// Actions
	// - If a locale exists in config but not in the database, create it
	// - If a locale exists in the database but not in config, mark as is_deleted

	// Get all locales
	const locales = await LocalesRepo.selectAll({
		select: ["code", "is_deleted"],
	});

	// Get locale codes from the database
	const localeCodesFromDB = locales.map((locale) => locale.code);

	// Get locale codes that are in the config but not in the database
	const missingLocales = localeCodes.filter(
		(locale) => !localeCodesFromDB.includes(locale),
	);
	if (missingLocales.length > 0) {
		logger("debug", {
			message: `Syncing new locales to the DB: ${missingLocales.join(", ")}`,
			scope: constants.logScopes.sync,
		});
	}

	// Get locale codes that are in the database but not in the config
	const localesToDelete = locales.filter(
		(locale) =>
			!localeCodes.includes(locale.code) &&
			Formatter.formatBoolean(locale.is_deleted) === false,
	);
	const localesToDeleteCodes = localesToDelete.map((locale) => locale.code);
	if (localesToDeleteCodes.length > 0) {
		logger("debug", {
			message: `Marking the following locales as deleted: ${localesToDeleteCodes.join(", ")}`,
			scope: constants.logScopes.sync,
		});
	}

	// Get locals that are in the database as is_deleted but in the config
	const unDeletedLocales = locales.filter(
		(locale) =>
			Formatter.formatBoolean(locale.is_deleted) &&
			localeCodes.includes(locale.code),
	);
	const unDeletedLocalesCodes = unDeletedLocales.map((locale) => locale.code);
	if (unDeletedLocalesCodes.length > 0) {
		logger("debug", {
			message: `Restoring previously deleted locales: ${unDeletedLocalesCodes.join(", ")}`,
			scope: constants.logScopes.sync,
		});
	}

	await Promise.all([
		missingLocales.length > 0 &&
			LocalesRepo.createMultiple({
				items: missingLocales.map((locale) => ({
					code: locale,
				})),
			}),
		localesToDeleteCodes.length > 0 &&
			LocalesRepo.updateSingle({
				data: {
					isDeleted: true,
					isDeletedAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
				where: [
					{
						key: "code",
						operator: "in",
						value: localesToDeleteCodes,
					},
				],
			}),
		unDeletedLocalesCodes.length > 0 &&
			LocalesRepo.updateSingle({
				data: {
					isDeleted: false,
					isDeletedAt: null,
					updatedAt: new Date().toISOString(),
				},
				where: [
					{
						key: "code",
						operator: "in",
						value: unDeletedLocales.map((locale) => locale.code),
					},
				],
			}),
	]);

	return {
		error: undefined,
		data: undefined,
	};
};

export default syncLocales;
