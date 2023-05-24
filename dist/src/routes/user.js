"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const user_1 = __importDefault(require("../controllers/user"));
const userRouter = (router) => {
    router.route("/signup").post(user_1.default.createUser);
};
exports.userRouter = userRouter;
