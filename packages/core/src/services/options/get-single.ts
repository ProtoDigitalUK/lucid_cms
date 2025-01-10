import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { OptionName } from "../../types/response.js";
import type { ServiceFn } from "../../utils/services/types.js";
import type { OptionsResponse } from "../../types/response.js";

const getSingle: ServiceFn<
	[
		{
			name: OptionName;
		},
	],
	OptionsResponse
> = async (context, data) => {
	const Options = Repository.get("options", context.db, context.config.db);
	const OptionsFormatter = Formatter.get("options");

	const optionRes = await Options.selectSingle({
		select: ["name", "value_bool", "value_int", "value_text"],
		where: [
			{
				key: "name",
				operator: "=",
				value: data.name,
			},
		],
		validation: {
			enabled: true,
			defaultError: {
				message: T("option_not_found_message"),
				status: 404,
			},
		},
	});
	if (optionRes.error) return optionRes;

	return {
		error: undefined,
		data: OptionsFormatter.formatSingle({
			option: optionRes.data,
		}),
	};
};

export default getSingle;
