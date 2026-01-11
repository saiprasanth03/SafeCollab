import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
