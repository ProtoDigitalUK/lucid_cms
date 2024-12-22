import z from "zod";
import { stringTranslations } from "../../../schemas/locales.js";
import constants from "../../../constants/constants.js";
import { collectionTableParts } from "../../../services/collection-migrator/helpers/build-table-name.js";

const BrickConfigSchema = z.object({
	key: z
		.string()
		.refine((val) => !val.includes(constants.db.collectionKeysJoin), {
			message: `Brick key cannot contain '${constants.db.collectionKeysJoin}'`,
		})
		// TODO: come up with a better solution that reserving certain keywords
		//* these keys are reserved due to them being used in the table name generation on the same level as the brick key
		.refine((val) => !val.includes(collectionTableParts.versions), {
			message: `Brick key cannot contain '${collectionTableParts.versions}'`,
		})
		.refine((val) => !val.includes(collectionTableParts.fields), {
			message: `Brick key cannot contain '${collectionTableParts.fields}'`,
		}),
	details: z
		.object({
			name: stringTranslations,
			summary: stringTranslations.optional(),
		})
		.optional(),
});

export default BrickConfigSchema;
