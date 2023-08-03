import { type Component, createSignal, Show } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { Link, useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
// Service
import api from "@/services/api";
// Components
import Form from "@/components/Groups/Form";
import Button from "@/components/Partials/Button";
import ErrorMessage from "@/components/Partials/ErrorMessage";

interface LoginFormProps {
  showForgotPassword?: boolean;
}

const LoginForm: Component<LoginFormProps> = ({ showForgotPassword }) => {
  // ----------------------------------------
  // State
  const [errors, setErrors] = createSignal<APIErrorResponse>();

  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  const navigate = useNavigate();

  // ----------------------------------------
  // Queries / Mutations
  const login = createMutation({
    mutationFn: api.auth.login,
    onSuccess: () => {
      spawnToast({
        title: "Login successful",
        message: "You have been logged in",
        status: "success",
      });
      navigate("/");
      setErrors(undefined);
    },
    onError: (error) => validateSetError(error, setErrors),
  });

  // ----------------------------------------
  // Render
  return (
    <Form.Root
      onSubmit={async () => {
        login.mutate({ username: username(), password: password() });
      }}
    >
      <Form.Input
        id="username"
        name="username"
        type="text"
        value={username()}
        onChange={setUsername}
        copy={{
          label: "Username",
        }}
        required={true}
        autoFoucs={true}
        autoComplete="username"
        errors={errors()?.errors?.body?.username}
      />
      <Form.Input
        id="password"
        name="password"
        type="password"
        value={password()}
        onChange={setPassword}
        copy={{
          label: "Password",
        }}
        required={true}
        autoComplete="current-password"
        errors={errors()?.errors?.body?.password}
      />
      <div class="flex flex-col items-start">
        <Show when={showForgotPassword}>
          <Link
            class="block text-sm mt-1 hover:text-secondaryH duration-200 transition-colors"
            type="button"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </Show>

        <div class="mt-10 w-full">
          <Show when={errors() && errors()?.message}>
            <ErrorMessage theme="container" message={errors()?.message} />
          </Show>

          <Button
            size="medium"
            classes="w-full"
            type="submit"
            theme="primary"
            loading={login.isLoading}
          >
            Login
          </Button>
        </div>
      </div>
    </Form.Root>
  );
};

export default LoginForm;
