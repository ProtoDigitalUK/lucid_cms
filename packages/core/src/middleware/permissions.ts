import { Request, Response, NextFunction } from "express";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Serivces
import usersServices from "@services/users/index.js";
// Types
import {
  PermissionT,
  EnvironmentPermissionT,
} from "@lucid/types/src/permissions.js";

const throwPermissionError = () => {
  throw new LucidError({
    type: "basic",
    name: "Permission Error",
    message: "You do not have permission to access this resource",
    status: 403,
  });
};

// ------------------------------------
// Validate Middleware
const permissions =
  (permissions: {
    global?: PermissionT[];
    environments?: EnvironmentPermissionT[];
  }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const environment = req.headers["lucid-environment"];

      // Lookup the users role and permissions
      const user = await service(
        usersServices.getSingle,
        false
      )({
        user_id: req.auth.id,
      });

      if (user.super_admin) return next();

      // No user permissions found
      if (user.permissions === undefined) throwPermissionError();

      // If the passed permission is a group type, check if the user has any of the permissions in the group
      if (permissions.global) {
        permissions.global.forEach((permission) => {
          if (!user.permissions?.global.includes(permission))
            throwPermissionError();
        });
      }

      // If the passed permission is a envrionment type, check if the user has the permission in the current environment
      if (permissions.environments) {
        if (!environment) throwPermissionError();

        const environmentPermissions = user.permissions?.environments?.find(
          (env) => env.key === environment
        );
        if (!environmentPermissions) throwPermissionError();

        permissions.environments.forEach((permission) => {
          if (!environmentPermissions?.permissions.includes(permission))
            throwPermissionError();
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };

export default permissions;
