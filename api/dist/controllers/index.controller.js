"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctrlIndex = void 0;
const user_model_1 = __importStar(require("../models/user.model"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const cookie_1 = require("cookie");
exports.ctrlIndex = {
    addUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { user, password } = req.body;
        const findUser = yield user_model_1.default.findOne({ user });
        if (findUser) {
            return res.json({ msg: "El usuario ya existe" });
        }
        const encryptPassword = yield (0, user_model_1.hashedPassword)(password);
        console.log(encryptPassword);
        yield user_model_1.default.create({ user, password: encryptPassword });
        res.end();
    }),
    loginUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { user, password } = req.body;
        const findUser = yield user_model_1.default.findOne({ user });
        if (findUser) {
            const validatePassword = yield (0, user_model_1.matchPassword)(password, findUser.password);
            if (validatePassword) {
                const token = (0, jsonwebtoken_1.sign)({
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
                    user,
                    role: "usuario"
                }, process.env.JWT_KEY);
                const serialized = (0, cookie_1.serialize)("token", token, {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    path: '/'
                });
                try {
                    res.setHeader('Set-Cookie', serialized);
                    console.log("hola");
                    return res.status(200).json({ success: "Inicio exitoso" });
                }
                catch (error) {
                    return res.status(401).json({ message: "Token invalido" });
                }
            }
            ;
            return res.json({ error: "Contraseña incorrecta" });
        }
        res.json({ error: "El usuario no existe" });
    }),
    validateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token)
            return res.json({ msg: "Acceso negado" });
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            return res.json({ decodedToken });
        }
        catch (error) {
            console.log(error);
        }
    })
};
