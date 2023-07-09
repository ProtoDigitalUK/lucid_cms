// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import environmentSchema from "@schemas/environments";
// Services
import deleteSingle from "@services/environments/delete-single";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof environmentSchema.deleteSingle.params,
  typeof environmentSchema.deleteSingle.body,
  typeof environmentSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const environment = await deleteSingle({
      key: req.params.key,
    });

    res.status(200).json(
      buildResponse(req, {
        data: environment,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: environmentSchema.deleteSingle,
  controller: deleteSingleController,
};