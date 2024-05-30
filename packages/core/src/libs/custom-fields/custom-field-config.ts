import type {
	CustomFieldConfigT,
	FieldTypes,
	CustomFieldColumnT,
} from "./types.js";

abstract class CustomFieldConfig<T extends FieldTypes> {
	abstract column: CustomFieldColumnT<T>;
	abstract get config(): CustomFieldConfigT<T>;

	// Methods
	protected keyToTitle(key: string): string {
		if (typeof key !== "string") return key;

		const title = key
			.split(/[-_]/g)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		return title;
	}
}

export default CustomFieldConfig;
