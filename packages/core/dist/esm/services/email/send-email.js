import nodemailer from "nodemailer";
import { getDBClient } from "../../db/db.js";
import service from "../../utils/app/service.js";
import Config from "../Config.js";
import emailsService from "../email/index.js";
const createEmailRow = async (client, data) => {
    await service(emailsService.createSingle, false, client)({
        from_address: data.options.from,
        from_name: data.options.fromName,
        to_address: data.options.to,
        subject: data.options.subject,
        cc: data.options.cc,
        bcc: data.options.bcc,
        template: data.template,
        data: data.data,
        delivery_status: data.delivery_status,
    });
};
const sendEmailAction = async (template, params) => {
    let fromName = params.options?.fromName || Config.email?.from?.name;
    let from = params.options?.from || Config.email?.from?.email;
    const mailOptions = {
        from: from,
        fromName: fromName,
        to: params.options?.to,
        subject: params.options?.subject,
        cc: params.options?.cc,
        bcc: params.options?.bcc,
        replyTo: params.options?.replyTo,
    };
    try {
        const html = await emailsService.renderTemplate(template, params.data);
        const smptConfig = Config.email?.smtp;
        if (!smptConfig) {
            throw new Error("SMTP config not found. The email has been stored in the database and can be sent manually.");
        }
        const transporter = nodemailer.createTransport({
            host: smptConfig.host,
            port: smptConfig.port,
            secure: smptConfig.secure,
            auth: {
                user: smptConfig.user,
                pass: smptConfig.pass,
            },
        });
        await transporter.sendMail({
            from: `${fromName} <${from}>`,
            to: mailOptions.to,
            subject: mailOptions.subject,
            cc: mailOptions.cc,
            bcc: mailOptions.bcc,
            replyTo: mailOptions.replyTo,
            html: html,
        });
        return {
            success: true,
            message: "Email sent successfully.",
            options: mailOptions,
        };
    }
    catch (error) {
        const err = error;
        return {
            success: false,
            message: err.message || "Failed to send email.",
            options: mailOptions,
        };
    }
};
export const sendEmailExternal = async (template, params, track) => {
    const client = await getDBClient();
    const result = await sendEmailAction(template, params);
    if (track) {
        try {
            await client.query("BEGIN");
            await createEmailRow(client, {
                template: template,
                options: result.options,
                delivery_status: result.success ? "sent" : "failed",
                data: params.data,
            });
            await client.query("COMMIT");
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    }
    return {
        success: result.success,
        message: result.message,
    };
};
export const sendEmailInternal = async (client, data) => {
    const result = await sendEmailAction(data.template, data.params);
    if (data.track) {
        if (!data.id) {
            await createEmailRow(client, {
                template: data.template,
                options: result.options,
                delivery_status: result.success ? "sent" : "failed",
                data: data.params.data,
            });
        }
        else {
            await service(emailsService.updateSingle, false, client)({
                id: data.id,
                data: {
                    from_address: result.options.from,
                    from_name: result.options.fromName,
                    delivery_status: result.success ? "sent" : "failed",
                },
            });
        }
    }
    return {
        success: result.success,
        message: result.message,
    };
};
//# sourceMappingURL=send-email.js.map