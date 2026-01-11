import GroupMember from "../models/GroupMember.js";
import { permissions } from "../utils/permissions.js";

export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const groupId = req.headers["x-group-id"];
      if (!groupId) {
        return res.status(400).json({ message: "Group ID missing" });
      }

      const membership = await GroupMember.findOne({
        userId: req.user.id,
        groupId,
      });

      if (!membership) {
        return res.status(403).json({ message: "Not a group member" });
      }

      const role = membership.role;

      if (!permissions[role] || !permissions[role][permission]) {
        return res.status(403).json({ message: "Permission denied" });
      }

      req.memberRole = role;
      next();
    } catch (error) {
      res.status(500).json({ message: "Permission check failed" });
    }
  };
};
