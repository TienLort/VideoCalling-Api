import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user";
import { spawn } from "child_process";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import config from "../config/firebase.config";

initializeApp(config.firebaseConfig);

const storage = getStorage();

const testGetFireBase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { urlUpload, type } = req.body;
    console.log({ urlUpload, type });
    const storageRef = ref(storage, `${urlUpload}`);
    if (type == "img") {
      getDownloadURL(storageRef)
        .then((url: string) => {
          const data = {
            url: url,
            name: urlUpload.split("/")[1],
            type: type,
          };
          const jsonData = JSON.stringify(data);

          const pythonProcess = spawn("python", [
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
        .catch((error: any) => {
          console.error("Lỗi lấy URL download:", error);
        });
    } else {
      getDownloadURL(storageRef)
        .then((url: string) => {
          const data = {
            url: url,
            name: urlUpload.split("/")[1],
            type: type,
          };
          const jsonData = JSON.stringify(data);
          const pythonProcess = spawn("python", [
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
        .catch((error: any) => {
          console.error("Lỗi lấy URL download:", error);
        });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  testGetFireBase,
};
