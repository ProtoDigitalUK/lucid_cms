import { PoolClient } from "pg";
export interface ServiceData {
    id: number;
    menu_id: number;
}
declare const getSingleItem: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Menu.js").MenuItemT>;
export default getSingleItem;
//# sourceMappingURL=get-single-item.d.ts.map