// Utils
import buildResponse from "@utils/app/build-response";
import service from "@utils/app/service";
// Schema
import mediaSchema from "@schemas/media";
// Services
import mediaService from "@services/media";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof mediaSchema.updateSingle.params,
  typeof mediaSchema.updateSingle.body,
  typeof mediaSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const media = await service(
      mediaService.updateSingle,
      true
    )({
      id: parseInt(req.params.id),
      data: {
        name: req.body.name,
        alt: req.body.alt,
        files: req.files,
      },
    });

    res.status(200).json(
      buildResponse(req, {
        data: media,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: mediaSchema.updateSingle,
  controller: updateSingleController,
};
