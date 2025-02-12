import { type Component, Match, Switch } from "solid-js";
import { Td } from "@/components/Groups/Table";
import Pill, { type PillProps } from "@/components/Partials/Pill";

interface PillColProps {
	text?: string | number | null;
	theme?: PillProps["theme"];
	options?: {
		include?: boolean;
	};
}

const PillCol: Component<PillColProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<Td
			options={{
				include: props?.options?.include,
			}}
		>
			<Switch>
				<Match when={props.text !== undefined}>
					<Pill theme={props.theme || "grey"}>{props.text}</Pill>
				</Match>
				<Match when={props.text === undefined}>{"-"}</Match>
			</Switch>
		</Td>
	);
};

export default PillCol;
