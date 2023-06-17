import z from "zod";
declare const _default: {
    schema: {
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            slug: z.ZodOptional<z.ZodString>;
            homepage: z.ZodOptional<z.ZodBoolean>;
            parent_id: z.ZodOptional<z.ZodNumber>;
            category_ids: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
            published: z.ZodOptional<z.ZodBoolean>;
            excerpt: z.ZodOptional<z.ZodString>;
            bricks: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodNumber>;
                key: z.ZodString;
                fields: z.ZodOptional<z.ZodArray<z.ZodType<{
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }, z.ZodTypeDef, {
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                }>, "many">>;
            }, "strip", z.ZodTypeAny, {
                key: string;
                id?: number | undefined;
                fields?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }, {
                key: string;
                id?: number | undefined;
                fields?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            title?: string | undefined;
            slug?: string | undefined;
            homepage?: boolean | undefined;
            parent_id?: number | undefined;
            category_ids?: number[] | undefined;
            published?: boolean | undefined;
            excerpt?: string | undefined;
            bricks?: {
                key: string;
                id?: number | undefined;
                fields?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }[] | undefined;
        }, {
            title?: string | undefined;
            slug?: string | undefined;
            homepage?: boolean | undefined;
            parent_id?: number | undefined;
            category_ids?: number[] | undefined;
            published?: boolean | undefined;
            excerpt?: string | undefined;
            bricks?: {
                key: string;
                id?: number | undefined;
                fields?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & {
                    items?: ({
                        type: import("../../../../brick-builder/dist").FieldTypesEnum;
                        key: string;
                        fields_id?: number | undefined;
                        parent_repeater?: number | undefined;
                        group_position?: number | undefined;
                        value?: any;
                        target?: any;
                    } & any)[] | undefined;
                })[] | undefined;
            }[] | undefined;
        }>;
        query: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    };
    controller: Controller<z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>, z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        slug: z.ZodOptional<z.ZodString>;
        homepage: z.ZodOptional<z.ZodBoolean>;
        parent_id: z.ZodOptional<z.ZodNumber>;
        category_ids: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        published: z.ZodOptional<z.ZodBoolean>;
        excerpt: z.ZodOptional<z.ZodString>;
        bricks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodNumber>;
            key: z.ZodString;
            fields: z.ZodOptional<z.ZodArray<z.ZodType<{
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            }, z.ZodTypeDef, {
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            key: string;
            id?: number | undefined;
            fields?: ({
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }, {
            key: string;
            id?: number | undefined;
            fields?: ({
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        title?: string | undefined;
        slug?: string | undefined;
        homepage?: boolean | undefined;
        parent_id?: number | undefined;
        category_ids?: number[] | undefined;
        published?: boolean | undefined;
        excerpt?: string | undefined;
        bricks?: {
            key: string;
            id?: number | undefined;
            fields?: ({
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }[] | undefined;
    }, {
        title?: string | undefined;
        slug?: string | undefined;
        homepage?: boolean | undefined;
        parent_id?: number | undefined;
        category_ids?: number[] | undefined;
        published?: boolean | undefined;
        excerpt?: string | undefined;
        bricks?: {
            key: string;
            id?: number | undefined;
            fields?: ({
                type: import("../../../../brick-builder/dist").FieldTypesEnum;
                key: string;
                fields_id?: number | undefined;
                parent_repeater?: number | undefined;
                group_position?: number | undefined;
                value?: any;
                target?: any;
            } & {
                items?: ({
                    type: import("../../../../brick-builder/dist").FieldTypesEnum;
                    key: string;
                    fields_id?: number | undefined;
                    parent_repeater?: number | undefined;
                    group_position?: number | undefined;
                    value?: any;
                    target?: any;
                } & any)[] | undefined;
            })[] | undefined;
        }[] | undefined;
    }>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=update-single.d.ts.map