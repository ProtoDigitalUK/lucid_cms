import {
	type Component,
	createSignal,
	createEffect,
	batch,
	createMemo,
} from "solid-js";
import type { CustomField, FieldResponse } from "@lucidcms/core/types";
import brickStore from "@/store/brickStore";
import Form from "@/components/Groups/Form";

interface ColourFieldProps {
	state: {
		brickIndex: number;
		fieldConfig: CustomField;
		fieldData?: FieldResponse;
		groupId?: number | string;
		repeaterKey?: string;
		contentLanguage?: number;
	};
}

export const ColourField: Component<ColourFieldProps> = (props) => {
	// -------------------------------
	// State
	const [getValue, setValue] = createSignal("");

	// -------------------------------
	// Memos
	const fieldData = createMemo(() => {
		return props.state.fieldData;
	});

	// -------------------------------
	// Effects
	createEffect(() => {
		const value = (fieldData()?.value as string | undefined) || "";
		setValue(value);
	});

	// -------------------------------
	// Render
	return (
		<div>
			<Form.Colour
				id={`field-${props.state.fieldConfig.key}-${props.state.brickIndex}-${props.state.groupId}`}
				value={getValue()}
				onChange={(value) => {
					batch(() => {
						brickStore.get.setFieldValue({
							brickIndex: props.state.brickIndex,
							key: props.state.fieldConfig.key,
							groupId: props.state.groupId,
							repeaterKey: props.state.repeaterKey,
							value: value,
						});
						setValue(value);
					});
				}}
				name={props.state.fieldConfig.key}
				copy={{
					label: props.state.fieldConfig.title,
					describedBy: props.state.fieldConfig.description,
				}}
				presets={props.state.fieldConfig.presets}
				disabled={props.state.fieldConfig.disabled}
				// errors={props.state.fieldError}
				required={props.state.fieldConfig.validation?.required || false}
			/>
		</div>
	);
};
