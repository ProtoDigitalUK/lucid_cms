import { queryDataFormat, } from "../../utils/app/query-helpers.js";
export default class User {
    static createSingle = async (client, data) => {
        const { columns, aliases, values } = queryDataFormat({
            columns: [
                "email",
                "username",
                "password",
                "super_admin",
                "first_name",
                "last_name",
            ],
            values: [
                data.email,
                data.username,
                data.password,
                data.super_admin,
                data.first_name,
                data.last_name,
            ],
        });
        const user = await client.query({
            text: `INSERT INTO lucid_users (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
            values: values.value,
        });
        return user.rows[0];
    };
    static getMultiple = async (client, query_instance) => {
        const users = client.query({
            text: `SELECT ${query_instance.query.select} FROM lucid_users ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
            values: query_instance.values,
        });
        const count = client.query({
            text: `SELECT COUNT(DISTINCT lucid_users.id) FROM lucid_users ${query_instance.query.where}`,
            values: query_instance.countValues,
        });
        const data = await Promise.all([users, count]);
        return {
            data: data[0].rows,
            count: Number(data[1].rows[0].count),
        };
    };
    static updateSingle = async (client, data) => {
        const { columns, aliases, values } = queryDataFormat({
            columns: [
                "first_name",
                "last_name",
                "username",
                "email",
                "password",
                "super_admin",
            ],
            values: [
                data.first_name,
                data.last_name,
                data.username,
                data.email,
                data.password,
                data.super_admin,
            ],
            conditional: {
                hasValues: {
                    updated_at: new Date().toISOString(),
                },
            },
        });
        const page = await client.query({
            text: `UPDATE lucid_users SET ${columns.formatted.update} WHERE id = $${aliases.value.length + 1} RETURNING id`,
            values: [...values.value, data.user_id],
        });
        return page.rows[0];
    };
    static deleteSingle = async (client, data) => {
        const user = await client.query({
            text: `DELETE FROM lucid_users WHERE id = $1 RETURNING *`,
            values: [data.id],
        });
        return user.rows[0];
    };
    static getSingle = async (client, query_instance) => {
        const user = await client.query({
            text: `SELECT ${query_instance.query.select} FROM lucid_users ${query_instance.query.where}`,
            values: query_instance.values,
        });
        return user.rows[0];
    };
}
//# sourceMappingURL=User.js.map