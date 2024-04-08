import type { Config } from "@protodigital/headless";
import type { PluginOptions } from "./types/types.js";
import plugin from "./plugin.js";

const headlessLocalStorage =
	(pluginOptions: PluginOptions) =>
	(config: Config): Config =>
		plugin(config, pluginOptions);

export default headlessLocalStorage;
