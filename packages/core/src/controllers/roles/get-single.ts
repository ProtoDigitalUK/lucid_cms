// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import rolesSchema from "@schemas/roles";
// Services
import roles from "@services/roles";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof rolesSchema.getSingle.params,
  typeof rolesSchema.getSingle.body,
  typeof rolesSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const role = await roles.getSingle({
      id: parseInt(req.params.id),
    });

    res.status(200).json(
      buildResponse(req, {
        data: role,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: rolesSchema.getSingle,
  controller: getSingleController,
};
