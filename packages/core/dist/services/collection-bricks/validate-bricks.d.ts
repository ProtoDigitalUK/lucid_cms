import { PoolClient } from "pg";
import { BrickObject } from "../../db/models/CollectionBrick";
import { EnvironmentT } from "../../db/models/Environment";
import { CollectionResT } from "@lucid/types/src/collections";
declare const validateBricks: (client: PoolClient, data: {
    builder_bricks: BrickObject[];
    fixed_bricks: BrickObject[];
    collection: CollectionResT;
    environment: EnvironmentT;
}) => Promise<void>;
export default validateBricks;
//# sourceMappingURL=validate-bricks.d.ts.map