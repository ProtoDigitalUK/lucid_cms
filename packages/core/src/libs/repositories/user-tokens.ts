import z from "zod";
import BaseRepository from "./base-repository.js";
import type { KyselyDB } from "../db/types.js";
import type DatabaseAdapter from "../db/adapter.js";

export default class UserTokensRepository extends BaseRepository<"lucid_user_tokens"> {
	constructor(db: KyselyDB, dbAdapter: DatabaseAdapter) {
		super(db, dbAdapter, "lucid_user_tokens");
	}
	tableSchema = z.object({
		id: z.number(),
		user_id: z.number(),
		token_type: z.union([z.literal("password_reset"), z.literal("refresh")]),
		token: z.string(),
		created_at: z.string().nullable(),
		expiry_date: z.string(),
	});
	columnFormats = {
		id: this.dbAdapter.getDataType("primary"),
		user_id: this.dbAdapter.getDataType("integer"),
		token_type: this.dbAdapter.getDataType("varchar", 255),
		token: this.dbAdapter.getDataType("varchar", 255),
		created_at: this.dbAdapter.getDataType("timestamp"),
		expiry_date: this.dbAdapter.getDataType("timestamp"),
	};
	queryConfig = undefined;
}
