import { queryDataFormat, } from "../../utils/app/query-helpers.js";
export default class Category {
    static getMultiple = async (client, query_instance) => {
        const categories = client.query({
            text: `SELECT ${query_instance.query.select} FROM lucid_categories ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
            values: query_instance.values,
        });
        const count = client.query({
            text: `SELECT COUNT(*) FROM lucid_categories ${query_instance.query.where}`,
            values: query_instance.countValues,
        });
        const data = await Promise.all([categories, count]);
        return {
            data: data[0].rows,
            count: Number(data[1].rows[0].count),
        };
    };
    static getSingle = async (client, data) => {
        const category = await client.query({
            text: "SELECT * FROM lucid_categories WHERE id = $1 AND environment_key = $2",
            values: [data.id, data.environment_key],
        });
        return category.rows[0];
    };
    static createSingle = async (client, data) => {
        const { columns, aliases, values } = queryDataFormat({
            columns: [
                "environment_key",
                "collection_key",
                "title",
                "slug",
                "description",
            ],
            values: [
                data.environment_key,
                data.collection_key,
                data.title,
                data.slug,
                data.description,
            ],
        });
        const res = await client.query({
            text: `INSERT INTO lucid_categories (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
            values: values.value,
        });
        return res.rows[0];
    };
    static updateSingle = async (client, data) => {
        const category = await client.query({
            name: "update-category",
            text: `UPDATE lucid_categories SET title = COALESCE($1, title), slug = COALESCE($2, slug), description = COALESCE($3, description) WHERE id = $4 AND environment_key = $5 RETURNING *`,
            values: [
                data.title,
                data.slug,
                data.description,
                data.id,
                data.environment_key,
            ],
        });
        return category.rows[0];
    };
    static deleteSingle = async (client, data) => {
        const category = await client.query({
            name: "delete-category",
            text: `DELETE FROM lucid_categories WHERE id = $1 AND environment_key = $2 RETURNING *`,
            values: [data.id, data.environment_key],
        });
        return category.rows[0];
    };
    static isSlugUniqueInCollection = async (client, data) => {
        const values = [
            data.collection_key,
            data.slug,
            data.environment_key,
        ];
        if (data.ignore_id) {
            values.push(data.ignore_id);
        }
        const res = await client.query({
            text: `SELECT * FROM lucid_categories WHERE collection_key = $1 AND slug = $2 AND environment_key = $3 ${data.ignore_id ? "AND id != $4" : ""}`,
            values: values,
        });
        const category = res.rows[0];
        if (category) {
            return false;
        }
        return true;
    };
}
//# sourceMappingURL=Category.js.map