require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const { connectDatabase } = require("./config/database");
const api = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", api);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    console.log("[auth-service] booting...");
    await connectDatabase();
    app.listen(PORT, () => console.log(`[auth-service] running on :${PORT}`));
  } catch (err) {
    console.error("[auth-service] failed to start:", err);
    process.exit(1);
  }
})();
