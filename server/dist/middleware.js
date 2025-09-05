"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
function auth(req, res, next) {
    const header = req.headers["authorization"];
    const decodedData = jsonwebtoken_1.default.verify(header, config_1.JWT_SECRET);
    if (decodedData) {
        //@ts-ignore
        req.userId = decodedData.userId;
        next();
    }
    else {
        res.status(403).json({
            message: "Invalid credentials"
        });
        return;
    }
}
