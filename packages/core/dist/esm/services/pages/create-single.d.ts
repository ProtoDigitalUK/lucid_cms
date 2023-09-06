import { PoolClient } from "pg";
export interface ServiceData {
    environment_key: string;
    title: string;
    slug: string;
    collection_key: string;
    homepage?: boolean;
    excerpt?: string;
    published?: boolean;
    parent_id?: number;
    category_ids?: number[];
    userId: number;
}
declare const createSingle: (client: PoolClient, data: ServiceData) => Promise<import("../../db/models/Page.js").PageT>;
export default createSingle;
//# sourceMappingURL=create-single.d.ts.map