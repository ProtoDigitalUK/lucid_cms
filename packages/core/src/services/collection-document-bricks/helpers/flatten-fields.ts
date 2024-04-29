import { v4 as uuidv4 } from "uuid";
import type { FieldSchemaType } from "../../../schemas/collection-fields.js";

export interface FieldInsertItem {
	key: FieldSchemaType["key"];
	type: FieldSchemaType["type"];
	value: FieldSchemaType["value"];
	languageId: FieldSchemaType["languageId"];
	groupRef?: string;
	groupId?: number;
}
export interface GroupInsertItem {
	ref: string;
	order: number;
	repeater: string;
	parentGroupRef?: string;
}

interface FlatFieldsResposne {
	fields: Array<FieldInsertItem>;
	groups: Array<GroupInsertItem>;
}

const flattenFields = (fields: FieldSchemaType[]): FlatFieldsResposne => {
	const fieldsRes: Array<FieldInsertItem> = [];
	const groupsRes: Array<GroupInsertItem> = [];

	// recursive function to parse fields
	const parseFields = (
		fields: FieldSchemaType[],
		groupMeta?: {
			ref?: string;
			repeaterKey?: string;
		},
	) => {
		// for each field, add to the fiedls array.
		// if its a repeater, store current repeater ref and pass it to the next level
		for (let i = 0; i < fields.length; i++) {
			const field = fields[i];
			if (field === undefined) continue;

			if (field.type === "repeater") {
				const repeaterKey = field.key;

				if (field.groups === undefined) continue;

				for (let j = 0; j < field.groups.length; j++) {
					const groupFields = field.groups[j];
					if (groupFields === undefined) continue;

					const groupRef = uuidv4();
					groupsRes.push({
						ref: groupRef,
						order: j,
						repeater: repeaterKey,
						parentGroupRef: groupMeta?.ref,
					});

					parseFields(groupFields, {
						ref: groupRef,
						repeaterKey,
					});
				}

				continue;
			}

			fieldsRes.push({
				key: field.key,
				type: field.type,
				value: field.value,
				languageId: field.languageId,
				groupRef: groupMeta?.ref,
			});
		}
	};
	parseFields(fields);

	return {
		fields: fieldsRes,
		groups: groupsRes,
	};
};

export default flattenFields;