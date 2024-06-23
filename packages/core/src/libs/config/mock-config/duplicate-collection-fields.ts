import lucid, { SQLiteAdapter, CollectionBuilder } from "../../../index.js";
import Database from "better-sqlite3";

const collection = new CollectionBuilder("page", {
	mode: "multiple",
	title: "Pages",
	singular: "Page",
})
	.addText("title")
	.addText("title");

export default lucid.config({
	host: "http://localhost:8393",
	db: new SQLiteAdapter({
		database: async () => new Database("db.sqlite"),
	}),
	keys: {
		encryptionKey:
			"a9876b549a7d3d0350a5995a0c81a73452bccfa8b489f5dca8bd83ecbb6a8cba",
		cookieSecret:
			"a9876b549a7d3d0350a5995a0c81a73452bccfa8b489f5dca8bd83ecbb6a8cba",
		refreshTokenSecret:
			"a9876b549a7d3d0350a5995a0c81a73452bccfa8b489f5dca8bd83ecbb6a8cba",
		accessTokenSecret:
			"a9876b549a7d3d0350a5995a0c81a73452bccfa8b489f5dca8bd83ecbb6a8cba",
	},
	collections: [collection],
	plugins: [],
});
