import T from "@/translations";
import { type Component, createEffect, Switch, Match } from "solid-js";
import { useNavigate } from "@solidjs/router";
import api from "@/services/api";
import LoginForm from "@/components/Forms/Auth/LoginForm";
import Loading from "@/components/Partials/Loading";
import ErrorBlock from "@/components/Partials/ErrorBlock";
import notifyIllustration from "@assets/illustrations/notify.svg";

const LoginRoute: Component = () => {
	// ----------------------------------------
	// State & Hooks
	const navigate = useNavigate();

	// ----------------------------------------
	// Queries
	const setupRequired = api.auth.useSetupRequired({
		queryParams: {},
	});

	// ----------------------------------------
	// Effects
	createEffect(() => {
		if (setupRequired.isSuccess && setupRequired.data.data.setupRequired) {
			navigate("/admin/setup");
		}
	});

	// ----------------------------------------
	// Render
	return (
		<Switch>
			<Match when={setupRequired.isLoading}>
				<Loading />
			</Match>
			<Match when={setupRequired.isError}>
				<ErrorBlock
					content={{
						image: notifyIllustration,
						title: T()("error_title"),
						description: T()("error_message"),
					}}
				/>
			</Match>
			<Match
				when={setupRequired.isSuccess && !setupRequired.data.data.setupRequired}
			>
				<>
					<h1 class="mb-2 text-center">{T()("login_route_title")}</h1>
					<p class="mb-10 text-center">{T()("login_route_description")}</p>
					<div class="mb-10">
						<LoginForm showForgotPassword={true} />
					</div>
				</>
			</Match>
		</Switch>
	);
};

export default LoginRoute;
