import { type Component, Switch, Match } from "solid-js";
import classNames from "classnames";
import { FaSolidFile } from "solid-icons/fa";
import { A } from "@solidjs/router";

interface NavigationLinkProps {
	title: string;
	href: string;
	icon: "page";
}

export const NavigationLink: Component<NavigationLinkProps> = (props) => {
	// ----------------------------------
	// Render
	return (
		<li class="mb-1.5 last:mb-0">
			<A
				title={props.title}
				href={props.href}
				class={classNames(
					"h-10 w-full flex bg-container-3 text-body fill-body hover:text-body hover:bg-container-4 transition-colors duration-200 ease-in-out items-center px-2.5 rounded-md",
				)}
				activeClass={classNames(
					"!bg-primary-base !text-primary-contrast !fill-primary-base-contrast",
				)}
				end
			>
				<Switch>
					<Match when={props.icon === "page"}>
						<FaSolidFile
							class={classNames("w-4 h-4 text-current")}
						/>
					</Match>
				</Switch>
				<span class="ml-2.5 block text-sm font-medium">
					{props.title}
				</span>
			</A>
		</li>
	);
};
