import { Router, Request, Response } from "express";
import z from "zod";
// Middleware
import validate from "../middleware/validate";

type Route = <
  ParamsT extends z.ZodTypeAny,
  BodyT extends z.ZodTypeAny,
  QueryT extends z.ZodTypeAny
>(
  router: Router,
  props: {
    method: "get" | "post" | "put" | "delete" | "patch";
    path: string;
    schema?: {
      params?: z.ZodTypeAny;
      query?: z.ZodTypeAny;
      body?: z.ZodTypeAny;
    };
    controller: Controller<ParamsT, BodyT, QueryT>;
  }
) => Router;

const route: Route = (router, props) => {
  const { method, path, controller } = props;

  // ------------------------------------
  // Assign middleware
  const middleware = [];

  // set middleware for validation
  if (props.schema?.params || props.schema?.query || props.schema?.body) {
    middleware.push(validate(z.object({ ...props.schema })));
  }

  switch (method) {
    case "get":
      router.get(path, middleware, controller);
      break;
    case "post":
      router.post(path, middleware, controller);
      break;
    case "put":
      router.put(path, middleware, controller);
      break;
    case "delete":
      router.delete(path, middleware, controller);
      break;
    case "patch":
      router.patch(path, middleware, controller);
      break;
    default:
      break;
  }

  return router;
};

export default route;
