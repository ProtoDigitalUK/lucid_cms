import { type Component, Switch, Match } from "solid-js";
// Types
import type { PagesResT } from "@headless/types/src/multiple-page";
// Components
import Table from "@/components/Groups/Table";
import UserDisplay from "@/components/Partials/UserDisplay";

interface AuthorColProps {
	author: PagesResT["author"];
	options?: {
		include?: boolean;
	};
}

const AuthorCol: Component<AuthorColProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<Table.Td
			options={{
				include: props?.options?.include,
			}}
		>
			<Switch>
				<Match when={props.author}>
					<UserDisplay
						user={{
							username: props.author?.username || "",
							first_name: props.author?.first_name,
							last_name: props.author?.last_name,
							thumbnail: undefined,
						}}
						mode="short"
					/>
				</Match>
				<Match when={!props.author}>-</Match>
			</Switch>
		</Table.Td>
	);
};

export default AuthorCol;
