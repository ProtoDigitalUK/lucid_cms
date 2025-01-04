import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type z from "zod";
import type emailSchema from "../../schemas/email.js";
import type { ServiceFn } from "../../utils/services/types.js";
import type { EmailResponse } from "../../types/response.js";

const getMultiple: ServiceFn<
	[
		{
			query: z.infer<typeof emailSchema.getMultiple.query>;
		},
	],
	{
		data: EmailResponse[];
		count: number;
	}
> = async (context, data) => {
	const EmailsRepo = Repository.get("emails", context.db, context.config.db);
	const EmailsFormatter = Formatter.get("emails");

	const emailsRes = await EmailsRepo.selectMultipleFiltered({
		select: [
			"id",
			"email_hash",
			"from_address",
			"from_name",
			"to_address",
			"subject",
			"cc",
			"bcc",
			"delivery_status",
			"template",
			"type",
			"sent_count",
			"error_count",
			"last_error_message",
			"last_attempt_at",
			"last_success_at",
			"created_at",
		],
		queryParams: data.query,
	});
	if (emailsRes.error) return emailsRes;

	return {
		error: undefined,
		data: {
			data: EmailsFormatter.formatMultiple({
				emails: emailsRes.data.main,
			}),
			count: Formatter.parseCount(emailsRes.data?.count?.count),
		},
	};
};

export default getMultiple;
