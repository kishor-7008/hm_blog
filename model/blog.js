import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    title: String,
    summary: String,
    content: String,
    file: String,
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
