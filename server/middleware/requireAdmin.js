export const requireAdmin = (req, res, next) => {
  if (req.groupRole !== "admin") {
    return res.status(403).json({ message: "Admin only action" });
  }
  next();
};
