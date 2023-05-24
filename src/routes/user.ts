import { Router } from "express";
import controller from "../controllers/user";

export const userRouter = (router: Router) => {
  router.route("/signup").post(controller.createUser);
};
