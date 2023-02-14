import mongoose from "mongoose";

const portSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui long nhap title"],
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const PostModel = mongoose.model("posts", portSchema);
