"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const firebase_config_1 = __importDefault(require("../config/firebase.config"));
const router = express_1.default.Router();
//Initialize a firebase application
(0, app_1.initializeApp)(firebase_config_1.default.firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = (0, storage_1.getStorage)();
// Setting up multer as a middleware to grab photo uploads
// const upload = multer({ storage: multer.memoryStorage() });
// router.post("/", upload.single("filename"), async (req, res) => {
//   try {
//     const dateTime = giveCurrentDateTime();
//     const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);
//     // Create file metadata including the content type
//     const metadata = {
//       contentType: req.file.mimetype,
//     };
//     // Upload the file in the bucket storage
//     const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
//     //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
//     // Grab the public url
//     const downloadURL = await getDownloadURL(snapshot.ref);
//     console.log("File successfully uploaded.");
//     return res.send({
//       message: "file uploaded to firebase storage",
//       name: req.file.originalname,
//       type: req.file.mimetype,
//       downloadURL: downloadURL,
//     });
//   } catch (error) {
//     return res.status(400).send(error.message);
//   }
// });
const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;
    return dateTime;
};
exports.default = router;
