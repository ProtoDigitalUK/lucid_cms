import service from "../../utils/app/service.js";
import emailsService from "../email/index.js";
const resendSingle = async (client, data) => {
    const email = await service(emailsService.getSingle, false, client)({
        id: data.id,
    });
    const status = await emailsService.sendEmailInternal(client, {
        template: email.template,
        params: {
            data: email.data || {},
            options: {
                to: email.to_address || "",
                subject: email.subject || "",
                from: email.from_address || undefined,
                fromName: email.from_name || undefined,
                cc: email.cc || undefined,
                bcc: email.bcc || undefined,
                replyTo: email.from_address || undefined,
            },
        },
        id: data.id,
    });
    const updatedEmail = await service(emailsService.getSingle, false, client)({
        id: data.id,
    });
    return {
        status,
        email: updatedEmail,
    };
};
export default resendSingle;
//# sourceMappingURL=resend-single.js.map