// Models
import { BrickObject } from "@db/models/CollectionBrick";
// Format
import { CollectionResT } from "@utils/format/format-collections";
// Services
import collectionBricksService from "@services/collection-bricks";
// Format
import { EnvironmentResT } from "@utils/format/format-environment";

export interface ServiceData {
  id: number;
  builder_bricks: Array<BrickObject>;
  fixed_bricks: Array<BrickObject>;
  collection: CollectionResT;
  environment: EnvironmentResT;
}

/*
  Updates multiple bricks for a collection. 
  
  This will create/update/delete bricks based on the data provided.
*/

const updateMultiple = async (data: ServiceData) => {
  // -------------------------------------------
  // Update/Create Bricks
  const builderBricksPromise =
    data.builder_bricks.map((brick, index) =>
      collectionBricksService.upsertSingle({
        reference_id: data.id,
        brick: brick,
        brick_type: "builder",
        order: index,
        environment: data.environment,
        collection: data.collection,
      })
    ) || [];
  const fixedBricksPromise =
    data.fixed_bricks.map((brick, index) =>
      collectionBricksService.upsertSingle({
        reference_id: data.id,
        brick: brick,
        brick_type: "fixed",
        order: index,
        environment: data.environment,
        collection: data.collection,
      })
    ) || [];

  const [buildBrickRes, fixedBrickRes] = await Promise.all([
    Promise.all(builderBricksPromise),
    Promise.all(fixedBricksPromise),
  ]);

  const builderIds = buildBrickRes.map((brickId) => brickId);
  const fixedIds = fixedBrickRes.map((brickId) => brickId);

  // -------------------------------------------
  // Delete unused bricks
  if (builderIds.length > 0)
    await collectionBricksService.deleteUnused({
      type: data.collection.type,
      reference_id: data.id,
      brick_ids: builderIds,
      brick_type: "builder",
    });
  if (fixedIds.length > 0)
    await collectionBricksService.deleteUnused({
      type: data.collection.type,
      reference_id: data.id,
      brick_ids: fixedIds,
      brick_type: "fixed",
    });
};

export default updateMultiple;
