import { PoolClient } from "pg";
import { BrickFieldObject } from "../../db/models/CollectionBrick";
export interface ServiceData {
    brick_id: number;
    data: BrickFieldObject;
}
declare const upsertField: (client: PoolClient, data: ServiceData) => Promise<number>;
export default upsertField;
//# sourceMappingURL=upsert-field.d.ts.map