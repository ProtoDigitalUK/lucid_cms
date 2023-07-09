// Models
import { CollectionT } from "@db/models/Collection";
import { EnvironmentT } from "@db/models/Environment";
// Internal packages
import { CollectionBrickConfigT } from "@lucid/collection-builder";
// Sercies
import brickConfig, { BrickConfigT } from "@services/brick-config";

export interface ServiceData {
  collection: CollectionT;
  environment: EnvironmentT;
}

const getAllAllowedBricks = (data: ServiceData) => {
  const allowedBricks: BrickConfigT[] = [];
  const allowedCollectionBricks: CollectionBrickConfigT[] = [];
  const brickConfigData = brickConfig.getBrickConfig();

  for (const brick of brickConfigData) {
    const brickAllowed = brickConfig.isBrickAllowed({
      key: brick.key,
      collection: data.collection,
      environment: data.environment,
    });

    if (brickAllowed.allowed && brickAllowed.brick) {
      allowedBricks.push(brickAllowed.brick);
    }
    if (brickAllowed.allowed && brickAllowed.collectionBrick) {
      if (brickAllowed.collectionBrick.builder)
        allowedCollectionBricks.push(brickAllowed.collectionBrick.builder);
      if (brickAllowed.collectionBrick.fixed)
        allowedCollectionBricks.push(brickAllowed.collectionBrick.fixed);
    }
  }
  return {
    bricks: allowedBricks,
    collectionBricks: allowedCollectionBricks,
  };
};

export default getAllAllowedBricks;
