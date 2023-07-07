declare const _default: {
    schema: {
        body: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        query: import("zod").ZodObject<{
            include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["fields"]>, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            include?: "fields"[] | undefined;
        }, {
            include?: "fields"[] | undefined;
        }>;
        params: import("zod").ZodObject<{
            collection_key: import("zod").ZodString;
        }, "strip", import("zod").ZodTypeAny, {
            collection_key: string;
        }, {
            collection_key: string;
        }>;
    };
    controller: Controller<import("zod").ZodObject<{
        collection_key: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        collection_key: string;
    }, {
        collection_key: string;
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["fields"]>, "many">>;
    }, "strip", import("zod").ZodTypeAny, {
        include?: "fields"[] | undefined;
    }, {
        include?: "fields"[] | undefined;
    }>>;
};
export default _default;
//# sourceMappingURL=get-all.d.ts.map