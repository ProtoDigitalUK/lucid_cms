// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import emailsSchema from "@schemas/email";
// Services
import emailsService from "@services/email";

// --------------------------------------------------
// Controller
const resendSingleController: Controller<
  typeof emailsSchema.resendSingle.params,
  typeof emailsSchema.resendSingle.body,
  typeof emailsSchema.resendSingle.query
> = async (req, res, next) => {
  try {
    const email = await service(
      emailsService.resendSingle,
      true
    )({
      id: parseInt(req.params.id),
    });

    res.status(200).json(
      buildResponse(req, {
        data: email,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: emailsSchema.resendSingle,
  controller: resendSingleController,
};
