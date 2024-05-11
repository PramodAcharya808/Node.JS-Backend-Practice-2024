import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    subTodo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubTodo",
      },
    ],
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
