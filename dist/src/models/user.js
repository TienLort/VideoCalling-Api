"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: [true, "Vui long nhap userName"],
    },
    userDisplayName: {
        type: String,
        required: [true, "Vui long nhap userDisplayName"],
    },
    userPassword: {
        type: String,
        required: [true, "Vui long nhap userPassword"],
    },
}, {
    timestamps: true,
});
exports.UserModel = mongoose_1.default.model("users", userSchema);
