import { LucidError, modelErrors, } from "../../utils/app/error-handler.js";
import service from "../../utils/app/service.js";
import environmentsService from "../environments/index.js";
import Permissions from "../Permissions.js";
const validatePermissions = async (client, permGroup) => {
    if (permGroup.length === 0)
        return [];
    const permissionSet = Permissions.permissions;
    const environmentsRes = await service(environmentsService.getAll, false, client)();
    const validPermissions = [];
    const permissionErrors = {};
    const environmentErrors = {};
    permGroup.forEach((obj) => {
        const envKey = obj.environment_key;
        for (let i = 0; i < obj.permissions.length; i++) {
            const permission = obj.permissions[i];
            if (!envKey) {
                if (permissionSet.global.includes(permission)) {
                    validPermissions.push({
                        permission,
                    });
                    continue;
                }
                else {
                    if (!permissionErrors[permission]) {
                        permissionErrors[permission] = {
                            key: permission,
                            code: "Invalid Permission",
                            message: `The permission "${permission}" is invalid against global permissions.`,
                        };
                    }
                }
            }
            else {
                if (permissionSet.environment.includes(permission)) {
                    const env = environmentsRes.find((e) => e.key === envKey);
                    if (!env) {
                        if (!environmentErrors[envKey]) {
                            environmentErrors[envKey] = {
                                key: envKey,
                                code: "Invalid Environment",
                                message: `The environment key "${envKey}" is invalid.`,
                            };
                        }
                        continue;
                    }
                    validPermissions.push({
                        permission,
                        environment_key: envKey,
                    });
                    continue;
                }
                else {
                    if (!permissionErrors[permission]) {
                        permissionErrors[permission] = {
                            key: permission,
                            code: "Invalid Permission",
                            message: `The permission "${permission}" is invalid against environment permissions.`,
                        };
                    }
                }
            }
        }
    });
    if (Object.keys(permissionErrors).length > 0 ||
        Object.keys(environmentErrors).length > 0) {
        throw new LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error creating the role.",
            status: 500,
            errors: modelErrors({
                permissions: permissionErrors,
                environments: environmentErrors,
            }),
        });
    }
    return validPermissions;
};
export default validatePermissions;
//# sourceMappingURL=validate-permissions.js.map