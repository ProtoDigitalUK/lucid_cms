import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import constants from "../../constants/constants.js";
import generateSecret from "../../utils/helpers/generate-secret.js";
import Formatter from "../../libs/formatters/index.js";
import { scrypt } from "@noble/hashes/scrypt";
import type { ServiceFn } from "../../utils/services/types.js";

const createInitialAdmin: ServiceFn<
	[
		{
			email: string;
			username: string;
			firstName?: string;
			lastName?: string;
			password: string;
		},
	],
	number
> = async (context, data) => {
	const Users = Repository.get("users", context.db, context.config.db);

	const userCountRes = await Users.count({ where: [] });
	if (userCountRes.error) return userCountRes;

	if (Formatter.parseCount(userCountRes.data?.count) > 0) {
		return {
			error: {
				type: "basic",
				message: T("setup_already_completed"),
				status: 400,
			},
			data: undefined,
		};
	}

	const { secret, encryptSecret } = generateSecret(
		context.config.keys.encryptionKey,
	);
	const hashedPassword = Buffer.from(
		scrypt(data.password, secret, constants.scrypt),
	).toString("base64");

	const newUserRes = await Users.createSingle({
		data: {
			email: data.email,
			username: data.username,
			first_name: data.firstName,
			last_name: data.lastName,
			super_admin: true,
			triggered_password_reset: false,
			password: hashedPassword,
			secret: encryptSecret,
		},
		returning: ["id"],
		validation: { enabled: true },
	});
	if (newUserRes.error) return newUserRes;

	return {
		error: undefined,
		data: newUserRes.data.id,
	};
};

export default createInitialAdmin;
