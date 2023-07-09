// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import formSubmissionsSchema from "@schemas/form-submissions";
// Services
import deleteSingle from "@services/form-submissions/delete-single";

// --------------------------------------------------
// Controller
const deleteSingleController: Controller<
  typeof formSubmissionsSchema.deleteSingle.params,
  typeof formSubmissionsSchema.deleteSingle.body,
  typeof formSubmissionsSchema.deleteSingle.query
> = async (req, res, next) => {
  try {
    const formSubmission = await deleteSingle({
      id: parseInt(req.params.id),
      form_key: req.params.form_key,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: formSubmission,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: formSubmissionsSchema.deleteSingle,
  controller: deleteSingleController,
};
