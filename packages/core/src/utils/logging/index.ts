import getLogger from "./logger.js";
import type constants from "../../constants/constants.js";

export type LogLevel = "error" | "warn" | "info" | "debug";

export type LoggerScopes =
	(typeof constants.logScopes)[keyof typeof constants.logScopes];

const logger = (
	level: LogLevel,
	data: {
		message: string;
		scope?: LoggerScopes | string;
		data?: Record<string, unknown>;
	},
) => {
	const message = messageFormat(level, data);
	const logData = data.data || {};
	const pinoLogger = getLogger();

	switch (level) {
		case "error":
			pinoLogger.error(logData, message);
			break;
		case "warn":
			pinoLogger.warn(logData, message);
			break;
		case "info":
			pinoLogger.info(logData, message);
			break;
		case "debug":
			pinoLogger.debug(logData, message);
			break;
		default:
			pinoLogger.error(logData, message);
			break;
	}
};

export const messageFormat = (
	level: LogLevel,
	data: {
		message: string;
		scope?: LoggerScopes | string;
	},
) => {
	const msgParts = [data.message];

	if (data.scope) {
		msgParts.unshift(`[${data.scope}]`);
	}

	return msgParts.join(" ");
};

export default logger;
