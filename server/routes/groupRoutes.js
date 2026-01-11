import express from "express";
import Group from "../models/Group.js";
import GroupMember from "../models/GroupMember.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { requirePermission } from "../middleware/requirePermission.js";

const router = express.Router();

/**
 * GET all groups of logged-in user
 */
router.get("/my-groups", protect, async (req, res) => {
  try {
    const memberships = await GroupMember.find({
      userId: req.user.id,
    }).populate("groupId");

    const groups = memberships.map((m) => ({
      groupId: m.groupId._id,
      name: m.groupId.name,
      role: m.role, // admin | editor | viewer
    }));

    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
});

/**
 * CREATE a new group
 * Creator automatically becomes ADMIN
 */
router.post("/create", protect, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const group = await Group.create({
      name: name.trim(),
      createdBy: req.user.id,
    });

    await GroupMember.create({
      userId: req.user.id,
      groupId: group._id,
      role: "admin",
    });

    res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Failed to create group" });
  }
});

/**
 * ADD MEMBER TO GROUP
 * Permission required: manageMembers (ADMIN only)
 */
router.post(
  "/add-member",
  protect,
  requirePermission("manageMembers"),
  async (req, res) => {
    try {
      const { email, role } = req.body;
      const groupId = req.headers["x-group-id"];

      if (!groupId) {
        return res.status(400).json({ message: "Group ID missing" });
      }

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      if (role && !["admin", "editor", "viewer"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const exists = await GroupMember.findOne({
        userId: user._id,
        groupId,
      });

      if (exists) {
        return res.status(400).json({ message: "Already a member" });
      }

      await GroupMember.create({
        userId: user._id,
        groupId,
        role: role || "viewer", // default = read-only
      });

      res.json({ message: "User added to group" });
    } catch (err) {
      console.error("Error adding member:", err);
      res.status(500).json({ message: "Failed to add member" });
    }
  }
);

/**
 * GET role of current user in active group
 */
router.get(
  "/my-role",
  protect,
  requirePermission("read"),
  async (req, res) => {
    res.json({ role: req.memberRole });
  }
);

/**
 * GET all members of active group
 * ADMIN only
 */
router.get(
  "/members",
  protect,
  requirePermission("manageMembers"),
  async (req, res) => {
    try {
      const groupId = req.headers["x-group-id"];

      if (!groupId) {
        return res.status(400).json({ message: "Group ID missing" });
      }

      const members = await GroupMember.find({ groupId }).populate(
        "userId",
        "email"
      );

      res.json(
        members.map((m) => ({
          id: m._id,
          email: m.userId.email,
          role: m.role,
        }))
      );
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ message: "Failed to fetch members" });
    }
  }
);

/**
 * UPDATE member role (ADMIN only)
 */
router.put(
  "/member/:memberId",
  protect,
  requirePermission("manageMembers"),
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!["admin", "editor", "viewer"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const member = await GroupMember.findById(req.params.memberId);

      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      // 🚨 HARD BLOCK: admin changing own role
      if (
        member.userId.toString() === req.user.id &&
        role !== "admin"
      ) {
        return res.status(400).json({
          message:
            "You cannot remove your own admin access. This action is blocked.",
        });
      }

      member.role = role;
      await member.save();

      res.json({ message: "Role updated successfully" });
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ message: "Failed to update role" });
    }
  }
);

/**
 * REMOVE member from group (ADMIN only)
 */
router.delete(
  "/member/:memberId",
  protect,
  requirePermission("manageMembers"),
  async (req, res) => {
    try {
      const member = await GroupMember.findById(req.params.memberId);

      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      // 🚨 Prevent admin removing themselves
      if (member.userId.toString() === req.user.id) {
        return res.status(400).json({
          message: "You cannot remove yourself from the group",
        });
      }

      await member.deleteOne();
      res.json({ message: "Member removed" });
    } catch (error) {
      console.error("Error removing member:", error);
      res.status(500).json({ message: "Failed to remove member" });
    }
  }
);
router.delete(
  "/:groupId",
  protect,
  async (req, res) => {
    try {
      const { groupId } = req.params;

      // check admin manually
      const admin = await GroupMember.findOne({
        groupId,
        userId: req.user.id,
        role: "admin",
      });

      if (!admin) {
        return res.status(403).json({
          message: "Only admin can delete group",
        });
      }

      await Group.findByIdAndDelete(groupId);
      await GroupMember.deleteMany({ groupId });

      res.json({ message: "Group deleted successfully" });
    } catch (error) {
      console.error("Delete group error:", error);
      res.status(500).json({ message: "Failed to delete group" });
    }
  }
);


export default router;
