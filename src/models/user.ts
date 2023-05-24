import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Vui long nhap userName"],
    },
    userDisplayName: {
      type: String,
      required: [true, "Vui long nhap userDisplayName"],
    },
    userPassword: {
      type: String,
      required: [true, "Vui long nhap userPassword"],
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("users", userSchema);
