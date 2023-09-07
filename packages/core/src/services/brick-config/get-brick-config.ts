// Services
import Config from "@services/Config.js";
// Internal packages
import { BrickBuilderT } from "@builders/brick-builder/index.js";

const getBrickConfig = (): BrickBuilderT[] => {
  const brickInstances = Config.bricks;

  if (!brickInstances) {
    return [];
  } else {
    return brickInstances;
  }
};

export default getBrickConfig;
