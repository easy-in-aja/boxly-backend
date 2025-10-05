const { Router } = require("express");
const likeRoutes = require("./likes.routes");

const api = Router();
api.get("/health", (req, res) =>
  res.json({ success: true, data: { service: "like", ok: true } })
);
api.use("/", likeRoutes);

module.exports = api;
