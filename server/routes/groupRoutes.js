import express from "express";
import Group from "../models/Group.js";
import GroupMember from "../models/GroupMember.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { requirePermission } from "../middleware/requirePermission.js";

const router = express.Router();

/* =========================================================
   GET: All groups of logged-in user
========================================================= */
router.get("/my-groups", protect, async (req, res) => {
  try {
    const memberships = await GroupMember.find({
      userId: req.user.id,
    }).populate("groupId");

    const groups = memberships.map((m) => ({
      groupId: m.groupId._id,
      name: m.groupId.name,
      role: m.role,
    }));

    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
});

/* =========================================================
   POST: Create group (creator = admin)
========================================================= */
router.post("/create", protect, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create group" });
  }
});

/* =========================================================
   POST: Add member (ADMIN only)
========================================================= */
router.post(
  "/add-member",
  protect,
  requirePermission("manageMembers"),
  async (req, res) => {
    try {
      const { email, role } = req.body;
      const groupId = req.headers["x-group-id"];

      if (!groupId) {
        return res.status(400).json({ message: "Group not selected" });
      }

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      if (role && !["admin", "editor", "viewer"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // ✅ USER MUST BE REGISTERED
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not registered. Ask them to sign up first.",
        });
      }

      // ✅ PREVENT DUPLICATE ADD
      const alreadyMember = await GroupMember.findOne({
        userId: user._id,
        groupId,
      });

      if (alreadyMember) {
        return res.status(400).json({
          message: "User is already a member of this group",
        });
      }

      await GroupMember.create({
        userId: user._id,
        groupId,
        role: role || "viewer",
      });

      res.json({ message: "Member added successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to add member" });
    }
  }
);

/* =========================================================
   GET: My role in active group
========================================================= */
router.get(
  "/my-role",
  protect,
  requirePermission("read"),
  (req, res) => {
    res.json({ role: req.memberRole });
  }
);

/* =========================================================
   GET: All members of group (ADMIN only)
========================================================= */
router.get(
  "/members",
  protect,
  requirePermission("manageMembers"),
  async (req, res) => {
    try {
      const groupId = req.headers["x-group-id"];

      if (!groupId) {
        return res.status(400).json({ message: "Group not selected" });
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
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch members" });
    }
  }
);

/* =========================================================
   PUT: Update member role (ADMIN only)
========================================================= */
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

      // 🚨 ADMIN CANNOT REMOVE OWN ADMIN ROLE
      if (
        member.userId.toString() === req.user.id &&
        role !== "admin"
      ) {
        return res.status(400).json({
          message: "You cannot remove your own admin access",
        });
      }

      member.role = role;
      await member.save();

      res.json({ message: "Role updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update role" });
    }
  }
);

/* =========================================================
   DELETE: Remove member (ADMIN only)
========================================================= */
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

      // 🚨 ADMIN CANNOT REMOVE THEMSELVES
      if (member.userId.toString() === req.user.id) {
        return res.status(400).json({
          message: "You cannot remove yourself from the group",
        });
      }

      await member.deleteOne();
      res.json({ message: "Member removed successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to remove member" });
    }
  }
);

/* =========================================================
   DELETE: Delete group (ADMIN only)
========================================================= */
router.delete("/:groupId", protect, async (req, res) => {
  try {
    const { groupId } = req.params;

    const admin = await GroupMember.findOne({
      groupId,
      userId: req.user.id,
      role: "admin",
    });

    if (!admin) {
      return res.status(403).json({
        message: "Only admin can delete the group",
      });
    }

    await Group.findByIdAndDelete(groupId);
    await GroupMember.deleteMany({ groupId });

    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete group" });
  }
});

export default router;
