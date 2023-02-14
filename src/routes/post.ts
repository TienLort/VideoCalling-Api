import { NextFunction, Request, Response, Router } from "express";
import { PostModel } from "../models/post";
import controller from "../controllers/post";

export const postRouter = (router: Router) => {
  router.route("/post").get(controller.getPosts).post(controller.createPost);
  router
    .route("/post/:id")
    .get(controller.getPostById)
    .put(controller.updatePostById)
    .delete(controller.deletePostById);
};
