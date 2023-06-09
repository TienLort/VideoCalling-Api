import express from "express";
import { userRouter } from "./user";
import { deepfakeRouter } from "./deepfake";

export const routers = () => {
  const router = express.Router();

  userRouter(router);
  deepfakeRouter(router);

  return router;
};
