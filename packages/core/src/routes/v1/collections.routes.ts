import { Router } from "express";
import r from "@utils/app/route.js";
// Controller
import getAll from "@controllers/collections/get-all.js";
import getSingle from "@controllers/collections/get-single.js";

// ------------------------------------
// Router
const router = Router();

r(router, {
  method: "get",
  path: "/",
  middleware: {
    authenticate: true,
  },
  schema: getAll.schema,
  controller: getAll.controller,
});

r(router, {
  method: "get",
  path: "/:collection_key",
  middleware: {
    authenticate: true,
    validateEnvironment: true,
  },
  schema: getSingle.schema,
  controller: getSingle.controller,
});

export default router;
