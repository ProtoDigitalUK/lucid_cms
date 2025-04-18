import { expect, test } from "vitest";
import T from "../../../translations/index.js";
import CollectionBuilder from "../../../libs/builders/collection-builder/index.js";
import { validateField } from "../../../services/documents-bricks/checks/check-validate-bricks-fields.js";
import CustomFieldSchema from "../schema.js";
import SelectCustomField from "./select.js";

const CONSTANTS = {
	selectOptions: [
		{
			label: "Option 1",
			value: "option-1",
		},
		{
			label: "Option 2",
			value: "option-2",
		},
		{
			label: "Option 3",
			value: "option-3",
		},
	],
};

// -----------------------------------------------
// Validation
const SelectCollection = new CollectionBuilder("collection", {
	mode: "multiple",
	details: {
		name: "Test",
		singularName: "Test",
	},
	config: {
		useTranslations: true,
	},
})
	.addSelect("standard_select", {
		options: CONSTANTS.selectOptions,
	})
	.addSelect("required_select", {
		options: CONSTANTS.selectOptions,
		validation: {
			required: true,
		},
	});

test("successfully validate field - select", async () => {
	// Standard
	const standardValidate = validateField(
		{
			key: "standard_select",
			type: "select",
			value: "option-1",
		},
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		SelectCollection.fields.get("standard_select")!,
		{
			media: [],
			users: [],
			documents: [],
		},
	);
	expect(standardValidate).length(0);

	// Required
	const requiredValidate = validateField(
		{
			key: "required_select",
			type: "select",
			value: "option-1",
		},
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		SelectCollection.fields.get("required_select")!,
		{
			media: [],
			users: [],
			documents: [],
		},
	);
	expect(requiredValidate).length(0);
});

test("fail to validate field - select", async () => {
	// Standard
	const standardValidate = {
		exists: validateField(
			{
				key: "standard_select",
				type: "select",
				value: "option-10",
			},
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			SelectCollection.fields.get("standard_select")!,
			{
				media: [],
				users: [],
				documents: [],
			},
		),
		number: validateField(
			{
				key: "standard_select",
				type: "select",
				value: 1,
			},
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			SelectCollection.fields.get("standard_select")!,
			{
				media: [],
				users: [],
				documents: [],
			},
		),
	};

	expect(standardValidate).toEqual({
		exists: [
			{
				key: "standard_select",
				message: T("please_ensure_a_valid_option_is_selected"),
			},
		],
		number: [
			{
				key: "standard_select",
				message: "Expected string, received number", // zod error message
			},
		],
	});

	// Required
	const requiredValidate = validateField(
		{
			key: "required_select",
			type: "select",
			value: undefined,
		},
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		SelectCollection.fields.get("required_select")!,
		{
			media: [],
			users: [],
			documents: [],
		},
	);

	expect(requiredValidate).toEqual([
		{
			key: "required_select",
			message: T("select_field_required"),
		},
	]);
});

// -----------------------------------------------
// Custom field config
test("custom field config passes schema validation", async () => {
	const field = new SelectCustomField("field", {
		details: {
			label: {
				en: "title",
			},
			summary: {
				en: "description",
			},
			placeholder: {
				en: "placeholder",
			},
		},
		config: {
			useTranslations: true,
			default: "",
			isHidden: false,
			isDisabled: false,
		},
		options: CONSTANTS.selectOptions,
		validation: {
			required: true,
		},
	});

	const res = await CustomFieldSchema.safeParseAsync(field.config);
	expect(res.success).toBe(true);
});
