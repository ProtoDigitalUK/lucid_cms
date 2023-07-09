// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import environmentSchema from "@schemas/environments";
// Services
import upsertSingle from "@services/environments/upsert-single";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof environmentSchema.updateSingle.params,
  typeof environmentSchema.updateSingle.body,
  typeof environmentSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const environment = await upsertSingle({
      data: {
        key: req.params.key,
        title: undefined,
        assigned_bricks: req.body.assigned_bricks,
        assigned_collections: req.body.assigned_collections,
        assigned_forms: req.body.assigned_forms,
      },
      create: false,
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
  schema: environmentSchema.updateSingle,
  controller: updateSingleController,
};
