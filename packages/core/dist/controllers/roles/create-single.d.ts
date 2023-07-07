declare const _default: {
    schema: {
        body: import("zod").ZodObject<{
            name: import("zod").ZodString;
            permission_groups: import("zod").ZodArray<import("zod").ZodObject<{
                environment_key: import("zod").ZodOptional<import("zod").ZodString>;
                permissions: import("zod").ZodArray<import("zod").ZodString, "many">;
            }, "strip", import("zod").ZodTypeAny, {
                permissions: string[];
                environment_key?: string | undefined;
            }, {
                permissions: string[];
                environment_key?: string | undefined;
            }>, "many">;
        }, "strip", import("zod").ZodTypeAny, {
            name: string;
            permission_groups: {
                permissions: string[];
                environment_key?: string | undefined;
            }[];
        }, {
            name: string;
            permission_groups: {
                permissions: string[];
                environment_key?: string | undefined;
            }[];
        }>;
        query: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
        params: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    };
    controller: Controller<import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>, import("zod").ZodObject<{
        name: import("zod").ZodString;
        permission_groups: import("zod").ZodArray<import("zod").ZodObject<{
            environment_key: import("zod").ZodOptional<import("zod").ZodString>;
            permissions: import("zod").ZodArray<import("zod").ZodString, "many">;
        }, "strip", import("zod").ZodTypeAny, {
            permissions: string[];
            environment_key?: string | undefined;
        }, {
            permissions: string[];
            environment_key?: string | undefined;
        }>, "many">;
    }, "strip", import("zod").ZodTypeAny, {
        name: string;
        permission_groups: {
            permissions: string[];
            environment_key?: string | undefined;
        }[];
    }, {
        name: string;
        permission_groups: {
            permissions: string[];
            environment_key?: string | undefined;
        }[];
    }>, import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>>;
};
export default _default;
//# sourceMappingURL=create-single.d.ts.map