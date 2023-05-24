"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routers = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("./user");
const routers = () => {
    const router = express_1.default.Router();
    (0, user_1.userRouter)(router);
    return router;
};
exports.routers = routers;
