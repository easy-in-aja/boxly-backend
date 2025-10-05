const { Router } = require("express");
const userRoutes = require("./users.routes");

const api = Router();

api.get("/health", (req, res) =>
  res.json({ success: true, data: { service: "user", ok: true } })
);
api.use("/", userRoutes);

module.exports = api;
