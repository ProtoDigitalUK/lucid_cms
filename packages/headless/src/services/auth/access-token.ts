import T from "../../translations/index.js";
import { type FastifyRequest, type FastifyReply } from "fastify";
import getConfig from "../config.js";
import constants from "../../constants.js";
import jwt from "jsonwebtoken";
import auth from "./index.js";
import type { UserPermissionsResT } from "@headless/types/src/users.js";
import { APIError } from "../../utils/app/error-handler.js";

export interface PayloadT {
	id: number;
	username: string;
	email: string;
	permissions: UserPermissionsResT["permissions"] | undefined;
}

const key = "_access";

export const generateAccessToken = async (
	reply: FastifyReply,
	request: FastifyRequest,
	user_id: number,
) => {
	try {
		const config = await getConfig();

		const user = await auth.getAuthenticatedUser(
			{
				db: request.server.db,
			},
			{
				user_id,
			},
		);

		const payload = {
			id: user.id,
			username: user.username,
			email: user.email,
			permissions: user.permissions,
		} satisfies PayloadT;

		const token = jwt.sign(payload, config.keys.accessTokenSecret, {
			expiresIn: constants.accessTokenExpiration,
		});

		reply.setCookie(key, token, {
			maxAge: constants.accessTokenExpiration,
			httpOnly: true,
			secure: config.mode === "production",
			sameSite: "strict",
			path: "/",
		});
	} catch (err) {
		throw new APIError({
			type: "authorisation",
			name: T("access_token_error_name"),
			message: T("access_token_error_message"),
			status: 401,
		});
	}
};

export const verifyAccessToken = async (request: FastifyRequest) => {
	try {
		const _access = request.cookies[key];
		const config = await getConfig();

		if (!_access) {
			return {
				success: false,
				data: null,
			};
		}

		const decode = jwt.verify(
			_access,
			config.keys.accessTokenSecret,
		) as PayloadT;

		return {
			success: true,
			data: decode,
		};
	} catch (err) {
		return {
			success: false,
			data: null,
		};
	}
};

export const clearAccessToken = (reply: FastifyReply) => {
	reply.clearCookie(key, { path: "/" });
};

export default {
	generateAccessToken,
	verifyAccessToken,
	clearAccessToken,
};
