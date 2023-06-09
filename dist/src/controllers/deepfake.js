"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const firebase_config_1 = __importDefault(require("../config/firebase.config"));
(0, app_1.initializeApp)(firebase_config_1.default.firebaseConfig);
const storage = (0, storage_1.getStorage)();
const testGetFireBase = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { urlUpload, type } = req.body;
        console.log({ urlUpload, type });
        const storageRef = (0, storage_1.ref)(storage, `${urlUpload}`);
        if (type == "img") {
            (0, storage_1.getDownloadURL)(storageRef)
                .then((url) => {
                const data = {
                    url: url,
                    name: urlUpload.split("/")[1],
                    type: type,
                };
                const jsonData = JSON.stringify(data);
                const pythonProcess = (0, child_process_1.spawn)("python", [
                    "E:\\AI-PBL\\PBL\\ViT\\efficient-vit\\getText.py",
                    jsonData,
                ]);
                console.log("text:", jsonData);
                pythonProcess.stdout.on("data", (data) => {
                    // Xử lý kết quả từ Python
                    const result = data.toString();
                    console.log("result:", result);
                    res
                        .status(200)
                        .json({ success: true, message: "Process completed successfully", result });
                });
                // Lắng nghe sự kiện kết thúc tiến trình
                pythonProcess.on("close", (code) => {
                    console.log(`Tiến trình Python đã kết thúc với mã trạng thái ${code}`);
                });
                // Xử lý lỗi từ Python
                pythonProcess.stderr.on("data", (data) => {
                    // Xử lý lỗi từ Python
                    const error = data.toString();
                    console.error(error);
                });
            })
                .catch((error) => {
                console.error("Lỗi lấy URL download:", error);
            });
        }
        else {
            (0, storage_1.getDownloadURL)(storageRef)
                .then((url) => {
                const data = {
                    url: url,
                    name: urlUpload.split("/")[1],
                    type: type,
                };
                const jsonData = JSON.stringify(data);
                const pythonProcess = (0, child_process_1.spawn)("python", [
                    "E:\\AI-PBL\\PBL\\ViT\\efficient-vit\\getText.py",
                    jsonData,
                ]);
                pythonProcess.stdout.on("data", (data) => {
                    // Xử lý kết quả từ Python
                    const result = data.toString();
                    console.log("result:", result);
                    res
                        .status(200)
                        .json({ success: true, message: "Process completed successfully", result });
                });
                // Lắng nghe sự kiện kết thúc tiến trình
                pythonProcess.on("close", (code) => {
                    console.log(`Tiến trình Python đã kết thúc với mã trạng thái ${code}`);
                });
                // Xử lý lỗi từ Python
                pythonProcess.stderr.on("data", (data) => {
                    // Xử lý lỗi từ Python
                    const error = data.toString();
                    console.error(error);
                });
            })
                .catch((error) => {
                console.error("Lỗi lấy URL download:", error);
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    testGetFireBase,
};
