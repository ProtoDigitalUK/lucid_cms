// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import formsSchema from "@schemas/forms";
// Services
import forms from "@services/form";

// --------------------------------------------------
// Controller
const getAllController: Controller<
  typeof formsSchema.getAll.params,
  typeof formsSchema.getAll.body,
  typeof formsSchema.getAll.query
> = async (req, res, next) => {
  try {
    const formsRes = await forms.getAll({
      query: req.query,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: formsRes,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: formsSchema.getAll,
  controller: getAllController,
};
