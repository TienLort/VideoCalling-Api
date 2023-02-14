import { NextFunction, Request, Response } from "express";
import { PostModel } from "../models/post";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      const error = new Error("Vui long nhap day du thong tin");
      throw error;
    }

    const post = await PostModel.create({
      title,
      description,
    });

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await PostModel.find();

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const post = await PostModel.findById(id);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const updatePostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;

    if (!title) {
      const error = new Error("Vui long nhap day du thong tin");
      throw error;
    }

    const post = await PostModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const deletePostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    await PostModel.findByIdAndDelete(id);

    res.status(200).json(id);
  } catch (error) {
    next(error);
  }
};

export default {
  createPost,
  getPosts,
  getPostById,
  updatePostById,
  deletePostById,
};
