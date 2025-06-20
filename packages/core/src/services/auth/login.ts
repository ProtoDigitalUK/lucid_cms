import T from "../../translations/index.js";
import { scrypt } from "@noble/hashes/scrypt.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import { decrypt } from "../../utils/helpers/encrypt-decrypt.js";
import constants from "../../constants/constants.js";
import type { ServiceFn } from "../../utils/services/types.js";

const login: ServiceFn<
	[
		{
			usernameOrEmail: string;
			password: string;
		},
	],
	{
		id: number;
	}
> = async (context, data) => {
	const Users = Repository.get("users", context.db, context.config.db);

	const userRes = await Users.selectSingleByEmailUsername({
		select: ["id", "password", "is_deleted", "secret"],
		where: {
			username: data.usernameOrEmail,
			email: data.usernameOrEmail,
		},
		validation: {
			enabled: true,
			defaultError: {
				type: "authorisation",
				message: T("login_error_message"),
				status: 401,
			},
		},
	});
	if (userRes.error) return userRes;

	if (Formatter.formatBoolean(userRes.data.is_deleted)) {
		return {
			error: {
				type: "authorisation",
				message: T("login_suspended_error_message"),
				status: 401,
			},
			data: undefined,
		};
	}

	const decryptedSecret = decrypt(
		userRes.data.secret,
		context.config.keys.encryptionKey,
	);
	const inputPasswordHash = Buffer.from(
		scrypt(data.password, decryptedSecret, constants.scrypt),
	).toString("base64");

	const valid = inputPasswordHash === userRes.data.password;

	if (!valid)
		return {
			error: {
				type: "authorisation",
				message: T("login_error_message"),
				status: 401,
			},
			data: undefined,
		};

	return {
		error: undefined,
		data: {
			id: userRes.data.id,
		},
	};
};

export default login;
