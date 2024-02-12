import { headlessConfig } from "@protodigital/headless";
import transporter from "./src/services/email-transporter.js";
import {
	BannerBrick,
	IntroBrick,
	DefaultMetaBrick,
	TestingBrick,
	PageMetaBrick,
} from "./src/headless/bricks/index.js";
import {
	PageCollection,
	SettingsCollection,
	BlogCollection,
} from "./src/headless/collections/index.js";

export default headlessConfig({
	mode: "development",
	host: "http://localhost:8393",
	databaseURL: process.env.DATABASE_URL as string,
	keys: {
		cookieSecret: process.env.COOKIE_SECRET as string,
		refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
		accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
	},
	sendEmail: async (data, tempalte) => {
		return {
			success: true,
			message: "Email sent",
		};
	},
	collections: [PageCollection, BlogCollection, SettingsCollection],
	bricks: [
		BannerBrick,
		IntroBrick,
		DefaultMetaBrick,
		TestingBrick,
		PageMetaBrick,
	],
});
