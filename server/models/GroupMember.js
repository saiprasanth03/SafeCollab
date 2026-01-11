import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"], // ✅ FIXED
      default: "viewer",
    },
  },
  { timestamps: true }
);

export default mongoose.model("GroupMember", groupMemberSchema);
