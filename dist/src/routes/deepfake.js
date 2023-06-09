"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepfakeRouter = void 0;
const deepfake_1 = __importDefault(require("../controllers/deepfake"));
const deepfakeRouter = (router) => {
    router.route("/deepfake").post(deepfake_1.default.testGetFireBase);
};
exports.deepfakeRouter = deepfakeRouter;
