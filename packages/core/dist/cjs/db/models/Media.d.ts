import { PoolClient } from "pg";
import { type MediaMetaDataT } from "../../utils/media/helpers.js";
import { SelectQueryBuilder } from "../../utils/app/query-helpers.js";
import { MediaResT } from "@lucid/types/src/media.js";
type MediaCreateSingle = (client: PoolClient, data: {
    key: string;
    name: string;
    type: MediaResT["type"];
    etag?: string;
    alt?: string;
    meta: MediaMetaDataT;
}) => Promise<MediaT>;
type MediaGetMultiple = (client: PoolClient, query_instance: SelectQueryBuilder) => Promise<{
    data: MediaT[];
    count: number;
}>;
type MediaGetSingle = (client: PoolClient, data: {
    key: string;
}) => Promise<MediaT>;
type MediaGetSingleById = (client: PoolClient, data: {
    id: number;
}) => Promise<MediaT>;
type MediaGetMultipleByIds = (client: PoolClient, data: {
    ids: number[];
}) => Promise<MediaT[]>;
type MediaDeleteSingle = (client: PoolClient, data: {
    key: string;
}) => Promise<{
    key: MediaT["key"];
    file_size: MediaT["file_size"];
}>;
type MediaUpdateSingle = (client: PoolClient, data: {
    key: string;
    name?: string;
    type?: MediaResT["type"];
    alt?: string;
    meta?: MediaMetaDataT;
    newKey?: string;
}) => Promise<{
    key: MediaT["key"];
}>;
export type MediaT = {
    id: number;
    key: string;
    e_tag: string;
    type: MediaResT["type"];
    name: string;
    alt: string | null;
    mime_type: string;
    file_extension: string;
    file_size: number;
    width: number | null;
    height: number | null;
    created_at: string;
    updated_at: string;
};
export default class Media {
    static createSingle: MediaCreateSingle;
    static getMultiple: MediaGetMultiple;
    static getSingle: MediaGetSingle;
    static getSingleById: MediaGetSingleById;
    static deleteSingle: MediaDeleteSingle;
    static updateSingle: MediaUpdateSingle;
    static getMultipleByIds: MediaGetMultipleByIds;
}
export {};
//# sourceMappingURL=Media.d.ts.map