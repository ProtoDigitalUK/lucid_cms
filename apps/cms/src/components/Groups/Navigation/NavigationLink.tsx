import { Component, Switch, Match } from "solid-js";
import classNames from "classnames";
import {
  FaSolidPhotoFilm,
  FaSolidUsers,
  FaSolidGear,
  FaSolidEarthEurope,
  FaSolidHouse,
} from "solid-icons/fa";
// Components
import { Link } from "@solidjs/router";

interface NavigationLinkProps {
  title: string;
  href: string;
  icon: "dashboard" | "environment" | "media" | "users" | "settings";
}

const NavigationLink: Component<NavigationLinkProps> = (props) => {
  // ----------------------------------
  // Hooks & States

  // ----------------------------------
  // Classes
  const iconClasses = classNames("w-5 h-5 text-white");

  // ----------------------------------
  // Render
  return (
    <li class="mb-2.5 last:mb-0">
      <Link
        title={props.title}
        href={props.href}
        class={classNames(
          "w-10 h-10 focus:outline-none focus:!border-primary focus:ring-0 flex items-center justify-center bg-white rounded-lg border border-transparent transition-colors duration-200 ease-in-out hover:border-primary"
        )}
        activeClass={classNames("!border-primary")}
        end
      >
        <Switch>
          <Match when={props.icon === "dashboard"}>
            <FaSolidHouse class={iconClasses} />
          </Match>
          <Match when={props.icon === "environment"}>
            <FaSolidEarthEurope class={iconClasses} />
          </Match>
          <Match when={props.icon === "media"}>
            <FaSolidPhotoFilm class={iconClasses} />
          </Match>
          <Match when={props.icon === "users"}>
            <FaSolidUsers class={iconClasses} />
          </Match>
          <Match when={props.icon === "settings"}>
            <FaSolidGear class={iconClasses} />
          </Match>
        </Switch>
      </Link>
    </li>
  );
};

export default NavigationLink;
