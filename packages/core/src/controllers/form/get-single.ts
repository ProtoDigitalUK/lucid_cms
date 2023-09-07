// Utils
import buildResponse from "@utils/app/build-response.js";
import service from "@utils/app/service.js";
// Schema
import formsSchema from "@schemas/forms.js";
// Services
import formsService from "@services/forms/index.js";

// --------------------------------------------------
// Controller
const getSingleController: Controller<
  typeof formsSchema.getSingle.params,
  typeof formsSchema.getSingle.body,
  typeof formsSchema.getSingle.query
> = async (req, res, next) => {
  try {
    const form = await service(
      formsService.getSingle,
      false
    )({
      key: req.params.form_key,
      environment_key: req.headers["lucid-environment"] as string,
    });

    res.status(200).json(
      buildResponse(req, {
        data: form,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: formsSchema.getSingle,
  controller: getSingleController,
};
