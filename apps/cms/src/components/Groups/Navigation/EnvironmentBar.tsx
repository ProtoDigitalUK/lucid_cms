import { Component, createEffect, createSignal, Show } from "solid-js";
import { useLocation } from "@solidjs/router";

const EnvironmentBar: Component = () => {
  // ----------------------------------
  // Hooks & States
  const location = useLocation();
  const [showBar, setShowBar] = createSignal(false);

  // ----------------------------------
  // Effects
  createEffect(() => {
    if (location.pathname.includes("/env/")) {
      setShowBar(true);
    } else {
      setShowBar(false);
    }
  });

  // ----------------------------------
  // Render
  return (
    <Show when={showBar()}>
      <div class="w-[240px] bg-green-500 h-full">ddasd</div>
    </Show>
  );
};

export default EnvironmentBar;