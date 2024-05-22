import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    comment: {
      type: String,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Video,
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
