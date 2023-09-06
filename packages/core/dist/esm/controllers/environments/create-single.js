import buildResponse from "../../utils/app/build-response.js";
import service from "../../utils/app/service.js";
import environmentSchema from "../../schemas/environments.js";
import environmentsService from "../../services/environments/index.js";
const createSingleController = async (req, res, next) => {
    try {
        const environment = await service(environmentsService.upsertSingle, true)({
            data: {
                key: req.body.key,
                title: req.body.title,
                assigned_bricks: req.body.assigned_bricks,
                assigned_collections: req.body.assigned_collections,
                assigned_forms: req.body.assigned_forms,
            },
            create: true,
        });
        res.status(200).json(buildResponse(req, {
            data: environment,
        }));
    }
    catch (error) {
        next(error);
    }
};
export default {
    schema: environmentSchema.createSingle,
    controller: createSingleController,
};
//# sourceMappingURL=create-single.js.map