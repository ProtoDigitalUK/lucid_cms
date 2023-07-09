// Utils
import buildResponse from "@utils/controllers/build-response";
// Schema
import pagesSchema from "@schemas/pages";
// Services
import pages from "@services/pages";

// --------------------------------------------------
// Controller
const updateSingleController: Controller<
  typeof pagesSchema.updateSingle.params,
  typeof pagesSchema.updateSingle.body,
  typeof pagesSchema.updateSingle.query
> = async (req, res, next) => {
  try {
    const page = await pages.updateSingle({
      id: parseInt(req.params.id),
      environment_key: req.headers["lucid-environment"] as string,
      userId: req.auth.id,

      title: req.body.title,
      slug: req.body.slug,
      homepage: req.body.homepage,
      parent_id: req.body.parent_id,
      category_ids: req.body.category_ids,
      published: req.body.published,
      excerpt: req.body.excerpt,
      builder_bricks: req.body.builder_bricks,
      fixed_bricks: req.body.fixed_bricks,
    });

    res.status(200).json(
      buildResponse(req, {
        data: page,
      })
    );
  } catch (error) {
    next(error as Error);
  }
};

// --------------------------------------------------
// Export
export default {
  schema: pagesSchema.updateSingle,
  controller: updateSingleController,
};
