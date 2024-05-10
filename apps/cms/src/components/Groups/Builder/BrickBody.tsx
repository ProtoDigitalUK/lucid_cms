import {
	type Component,
	For,
	createMemo,
	createSignal,
	onMount,
	Show,
} from "solid-js";
import classNames from "classnames";
import type { CustomField } from "@lucidcms/core/types";
import brickStore, { type BrickData } from "@/store/brickStore";
import CustomFields from "./CustomFields";

interface BrickProps {
	state: {
		open: boolean;
		brick: BrickData;
		configFields: CustomField[];
		labelledby?: string;
	};
}

export const BrickBody: Component<BrickProps> = (props) => {
	// -------------------------------
	// State
	const [getActiveTab, setActiveTab] = createSignal<string>();

	// ----------------------------------
	// Memos
	const brickIndex = createMemo(() => {
		return brickStore.get.bricks.findIndex(
			(brick) => brick.id === props.state.brick.id,
		);
	});
	const allTabs = createMemo(
		() =>
			props.state.configFields?.filter((field) => field.type === "tab") ||
			[],
	);

	// -------------------------------
	// Effects
	onMount(() => {
		if (getActiveTab() === undefined) {
			setActiveTab(allTabs()[0]?.key);
		}
	});

	// ----------------------------------
	// Render
	return (
		<div
			class={classNames(
				"transform-gpu origin-top duration-200 transition-transform overflow-hidden",
				{
					"scale-y-100 h-auto": props.state.open,
					"scale-y-0 h-0": !props.state.open,
				},
			)}
			role="region"
			aria-labelledby={props.state.labelledby}
		>
			{/* Tabs */}
			<Show when={allTabs().length > 0}>
				<div class="border-b border-border mb-15 flex flex-wrap">
					<For each={allTabs()}>
						{(tab) => (
							<button
								class={classNames(
									"border-b border-border -mb-px text-sm font-medium py-1 px-2 first:pl-0",
									{
										"border-primary-base":
											getActiveTab() === tab.key,
									},
								)}
								onClick={() => setActiveTab(tab.key)}
								type="button"
							>
								{tab.title}
							</button>
						)}
					</For>
				</div>
			</Show>
			{/* Body */}
			<For each={props.state.configFields}>
				{(config) => (
					<CustomFields.DynamicField
						state={{
							fields: props.state.brick.fields,
							brickIndex: brickIndex(),
							fieldConfig: config,
							activeTab: getActiveTab(),
						}}
					/>
				)}
			</For>
		</div>
	);
};
