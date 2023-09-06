"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearJWT = exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Config_js_1 = __importDefault(require("../Config.js"));
const generateJWT = (res, user) => {
    const { id, email, username } = user;
    const payload = {
        id,
        email,
        username,
    };
    const token = jsonwebtoken_1.default.sign(payload, Config_js_1.default.secret, {
        expiresIn: "7d",
    });
    res.cookie("_jwt", token, {
        maxAge: 86400000 * 7,
        httpOnly: true,
        secure: Config_js_1.default.mode === "production",
        sameSite: "strict",
    });
    res.cookie("auth", true, {
        maxAge: 86400000 * 7,
    });
};
exports.generateJWT = generateJWT;
const verifyJWT = (req) => {
    try {
        const { _jwt } = req.cookies;
        if (!_jwt) {
            return {
                sucess: false,
                data: null,
            };
        }
        const decoded = jsonwebtoken_1.default.verify(_jwt, Config_js_1.default.secret);
        return {
            sucess: true,
            data: decoded,
        };
    }
    catch (err) {
        return {
            sucess: false,
            data: null,
        };
    }
};
exports.verifyJWT = verifyJWT;
const clearJWT = (res) => {
    res.clearCookie("_jwt");
    res.clearCookie("auth");
};
exports.clearJWT = clearJWT;
exports.default = {
    generateJWT: exports.generateJWT,
    verifyJWT: exports.verifyJWT,
    clearJWT: exports.clearJWT,
};
//# sourceMappingURL=jwt.js.map