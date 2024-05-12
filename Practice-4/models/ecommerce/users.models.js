import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },
    userPassword: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 12,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timeseries: true }
);

export const User = mongoose.model("User", userSchema);
