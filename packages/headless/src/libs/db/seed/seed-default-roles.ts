import T from "../../../translations/index.js";
import constants from "../../../constants.js";
import { InternalError } from "../../../utils/error-handler.js";
import serviceWrapper from "../../../utils/service-wrapper.js";
import rolesServices from "../../../services/roles/index.js";
import Repository from "../../repositories/index.js";
import Formatter from "../../formatters/index.js";

const seedDefaultRoles = async (serviceConfig: ServiceConfigT) => {
	try {
		const RolesRepo = Repository.get("roles", serviceConfig.db);

		const totalRoleCount = await RolesRepo.count();
		if (Formatter.parseCount(totalRoleCount?.count) > 0) return;

		const rolePromises = [];
		for (const role of constants.seedDefaults.roles) {
			rolePromises.push(
				serviceWrapper(rolesServices.createSingle, false)(
					serviceConfig,
					{
						name: role.name,
						description: role.description,
						permissions: role.permissions,
					},
				),
			);
		}
		await Promise.all(rolePromises);
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("roles").toLowerCase(),
			}),
		);
	}
};

export default seedDefaultRoles;