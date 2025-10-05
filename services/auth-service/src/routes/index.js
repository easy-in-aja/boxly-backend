const { Router } = require("express");
const authRoutes = require("./auth.routes");

const api = Router();

api.get("/health", (req, res) =>
  res.json({ success: true, data: { service: "auth", ok: true } })
);
api.use("/auth", authRoutes);

module.exports = api;
