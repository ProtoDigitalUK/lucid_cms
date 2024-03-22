import T from "../../translations/index.js";
import path from "node:path";
import fs from "fs-extra";

const getConfigPath = (cwd: string): string => {
	let configPath: string | undefined = undefined;
	const root = path.parse(cwd).root;
	// const configFileName = "headless.config";
	const configFileName = "headless.config-test";
	const configExtensions = [".ts", ".js"];

	const search = (cwd: string): void => {
		const files = fs.readdirSync(cwd);
		const configFiles = files.filter((file) => {
			const { name, ext } = path.parse(file);
			return name === configFileName && configExtensions.includes(ext);
		});

		if (configFiles.length > 0) {
			configPath = path.resolve(cwd, configFiles[0]);
			return;
		}

		const parent = path.resolve(cwd, "..");
		if (parent === cwd || parent === root) {
			return;
		}

		search(parent);
	};
	search(cwd);

	if (!configPath) {
		throw new Error(T("cannot_find_config_path"));
	}

	return configPath;
};

export default getConfigPath;
