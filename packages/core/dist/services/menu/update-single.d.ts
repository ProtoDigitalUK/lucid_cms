import { MenuItemUpdate } from "../../schemas/menus";
export interface ServiceData {
    environment_key: string;
    id: number;
    key?: string;
    name?: string;
    description?: string;
    items?: MenuItemUpdate[];
}
declare const updateSingle: (data: ServiceData) => Promise<import("../../utils/format/format-menu").MenuResT>;
export default updateSingle;
//# sourceMappingURL=update-single.d.ts.map