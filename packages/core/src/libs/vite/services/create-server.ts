import constants from "../../../constants/constants.js";
import { join } from "node:path";
import { createServer } from "vite";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import generateClientMount from "../generators/client-mount.js";
import generateHTML from "../generators/html.js";

//* while plugins dont support registering custom components this is not used. This will need proper error handling, logging and config etc.
const createDevServer = async () => {
	const cwd = process.cwd();

	await Promise.all([generateClientMount(), generateHTML()]);

	const server = await createServer({
		plugins: [tailwindcss(), solidPlugin()],
		root: join(cwd, constants.vite.outputDir),
		server: {
			port: constants.vite.port,
		},
		base: "/admin",
		// logLevel: 'silent',
	});

	await server.listen();

	return server.httpServer?.address();
};

export default createDevServer;
