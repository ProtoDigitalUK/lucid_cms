declare const _default: {
    createSingle: (data: import("./create-single").ServiceData) => Promise<import("../../utils/format/format-menu").MenuResT>;
    deleteSingle: (data: import("./delete-single").ServiceData) => Promise<import("../../db/models/Menu").MenuT>;
    getMultiple: (data: import("./get-multiple").ServiceData) => Promise<{
        data: import("../../utils/format/format-menu").MenuResT[];
        count: number;
    }>;
    getSingle: (data: import("./get-single").ServiceData) => Promise<import("../../utils/format/format-menu").MenuResT>;
    updateSingle: (data: import("./update-single").ServiceData) => Promise<import("../../utils/format/format-menu").MenuResT>;
    checkKeyUnique: (data: import("./check-key-unique").ServiceData) => Promise<void>;
    getItems: (data: import("./get-items").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
    getSingleItem: (data: import("./get-single-item").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT>;
    deleteItemsByIds: (data: import("./delete-items-by-ids").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
    upsertMultipleItems: (data: import("./upsert-multiple-items").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
    upsertItem: (data: import("./upsert-item").ServiceData) => Promise<import("../../db/models/Menu").MenuItemT[]>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map