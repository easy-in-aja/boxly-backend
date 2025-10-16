const { Router } = require("express");
const postRoutes = require("./posts.routes");

const api = Router();
api.get("/health", (req, res) =>
  res.json({ success: true, data: { service: "post", ok: true } })
);
api.use("/", postRoutes);

module.exports = api;
