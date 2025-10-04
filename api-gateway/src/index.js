import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const FEED_SERVICE_URL = process.env.FEED_SERVICE_URL;
const LIKE_SERVICE_URL = process.env.LIKE_SERVICE_URL;
const COMMENT_SERVICE_URL = process.env.COMMENT_SERVICE_URL;

// Helper function untuk proxy request
async function proxyRequest(req, res, targetUrl) {
  try {
    const response = await axios({
      method: req.method,
      url: `${targetUrl}${req.originalUrl}`,
      data: req.body,
      headers: {
        ...req.headers,
        host: undefined, // Remove host header
      },
      validateStatus: () => true, // Accept all status codes
    });

    // Forward response
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    if (!res.headersSent) {
      res.status(502).json({ 
        message: "Gateway error", 
        error: error.message 
      });
    }
  }
}

// Forward /api/auth/* to auth-service
app.use("/api/auth", (req, res) => {
  proxyRequest(req, res, AUTH_SERVICE_URL);
});

// Forward /api/users/* to user-service
app.use("/api/users", (req, res) => {
  proxyRequest(req, res, USER_SERVICE_URL);
});

// Forward /api/feed/* to feed-service
app.use("/api/feed", (req, res) => {
  proxyRequest(req, res, FEED_SERVICE_URL);
});

// Forward /api/like/* to like-service
app.use("/api/like", (req, res) => {
  proxyRequest(req, res, LIKE_SERVICE_URL);
});

// Forward /api/comment/* to comment-service
app.use("/api/comment", (req, res) => {
  proxyRequest(req, res, COMMENT_SERVICE_URL);
});

// Hanya dengarkan saat dijalankan lokal
if (process.env.VERCEL !== "1") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API Gateway running on port ${port}`);
    console.log("AUTH_SERVICE_URL:", AUTH_SERVICE_URL);
    console.log("USER_SERVICE_URL:", USER_SERVICE_URL);
    console.log("FEED_SERVICE_URL:", FEED_SERVICE_URL);
    console.log("LIKE_SERVICE_URL:", LIKE_SERVICE_URL);
    console.log("COMMENT_SERVICE_URL:", COMMENT_SERVICE_URL);
  });
}

// Ekspor handler untuk Vercel
export default app;
