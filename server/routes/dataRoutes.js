import express from "express";
import GroupData from "../models/GroupData.js";
import { protect } from "../middleware/auth.js";
import { requirePermission } from "../middleware/requirePermission.js";

const router = express.Router();

/**
 * GET all data for active group
 * Roles allowed: admin, editor, viewer
 */
router.get(
  "/",
  protect,
  requirePermission("read"),
  async (req, res) => {
    try {
      const groupId = req.headers["x-group-id"];

      const data = await GroupData.find({ groupId }).sort({
        createdAt: -1,
      });

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch data" });
    }
  }
);

/**
 * CREATE new data
 * Roles allowed: admin, editor
 */
router.post(
  "/",
  protect,
  requirePermission("create"),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const groupId = req.headers["x-group-id"];

      if (!title || !content) {
        return res.status(400).json({ message: "All fields required" });
      }

      const item = await GroupData.create({
        groupId,
        title,
        content,
        createdBy: req.user.id,
      });

      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to create data" });
    }
  }
);

/**
 * UPDATE existing data
 * Roles allowed: admin, editor
 */
router.put(
  "/:id",
  protect,
  requirePermission("update"),
  async (req, res) => {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: "All fields required" });
      }

      const updated = await GroupData.findByIdAndUpdate(
        req.params.id,
        { title, content },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Data not found" });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update data" });
    }
  }
);

/**
 * DELETE data
 * Roles allowed: admin only
 */
router.delete(
  "/:id",
  protect,
  requirePermission("delete"),
  async (req, res) => {
    try {
      await GroupData.findByIdAndDelete(req.params.id);
      res.json({ message: "Data deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete data" });
    }
  }
);

export default router;

