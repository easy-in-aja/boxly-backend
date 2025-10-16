const { Router } = require("express");
const commentRoutes = require("./comments.routes");

const api = Router();
api.get("/health", (req, res) =>
  res.json({ success: true, data: { service: "comment", ok: true } })
);
api.use("/", commentRoutes);

module.exports = api;
