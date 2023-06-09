import { Router } from "express";
import controller from "../controllers/deepfake";

export const deepfakeRouter = (router: Router) => {
  router.route("/deepfake").post(controller.testGetFireBase);
};
