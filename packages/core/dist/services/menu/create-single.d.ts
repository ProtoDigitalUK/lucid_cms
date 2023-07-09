import { MenuItem } from "../../schemas/menus";
export interface ServiceData {
    environment_key: string;
    key: string;
    name: string;
    description?: string;
    items?: MenuItem[];
}
declare const createSingle: (data: ServiceData) => Promise<import("../../db/models/Menu").MenuT>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map