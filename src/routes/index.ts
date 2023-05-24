import express from "express";
import { userRouter } from "./user";

export const routers = () => {
  const router = express.Router();

  userRouter(router);

  return router;
};
