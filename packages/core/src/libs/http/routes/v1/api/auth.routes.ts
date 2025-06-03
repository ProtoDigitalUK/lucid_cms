import { Hono } from "hono";
import loginController from "../../../controllers/auth/login.js";
import getCSRFController from "../../../controllers/auth/get-csrf.js";
import logoutController from "../../../controllers/auth/logout.js";
import tokenController from "../../../controllers/auth/token.js";
import type { LucidHonoGeneric } from "../../../../../types/hono.js";

const authRoutes = new Hono<LucidHonoGeneric>()
	.get("/csrf", ...getCSRFController)
	.post("/login", ...loginController)
	.post("/logout", ...logoutController)
	.post("/token", ...tokenController);

export default authRoutes;
