import GroupMember from "../models/GroupMember.js";

export const requireGroupMember = async (req, res, next) => {
  try {
    const groupId = req.headers["x-group-id"];

    if (!groupId) {
      return res.status(400).json({ message: "Group ID missing" });
    }

    const member = await GroupMember.findOne({
      userId: req.user.id,
      groupId,
    });

    if (!member) {
      return res.status(403).json({ message: "Not a group member" });
    }

    req.groupRole = member.role; // admin / member
    next();
  } catch (error) {
    res.status(500).json({ message: "Group authorization failed" });
  }
};

