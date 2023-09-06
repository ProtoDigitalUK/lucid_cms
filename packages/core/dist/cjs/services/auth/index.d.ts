declare const _default: {
    csrf: {
        generateCSRFToken: (res: import("express").Response<any, Record<string, any>>) => string;
        verifyCSRFToken: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>) => boolean;
        clearCSRFToken: (res: import("express").Response<any, Record<string, any>>) => void;
    };
    jwt: {
        generateJWT: (res: import("express").Response<any, Record<string, any>>, user: import("@lucid/types/src/users.js").UserResT) => void;
        verifyJWT: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>) => {
            sucess: boolean;
            data: null;
        } | {
            sucess: boolean;
            data: {
                id: number;
                email: string;
                username: string;
            };
        };
        clearJWT: (res: import("express").Response<any, Record<string, any>>) => void;
    };
    login: (client: import("pg").PoolClient, data: import("./login.js").ServiceData) => Promise<import("@lucid/types/src/users.js").UserResT>;
    validatePassword: (data: import("./validate-password.js").ServiceData) => Promise<boolean>;
    sendResetPassword: (client: import("pg").PoolClient, data: import("./send-reset-password.js").ServiceData) => Promise<{
        message: string;
    }>;
    verifyResetPassword: (client: import("pg").PoolClient, data: import("./verify-reset-password.js").ServiceData) => Promise<{}>;
    resetPassword: (client: import("pg").PoolClient, data: import("./reset-password.js").ServiceData) => Promise<{
        message: string;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map