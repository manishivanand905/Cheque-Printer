const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const chequeRoutes = require("./routes/chequeRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const vercelPreviewPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

function isAllowedOrigin(origin) {
  if (!origin || allowedOrigins.length === 0) {
    return true;
  }

  return allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin);
}

const corsOptions = {
  origin(origin, callback) {
    callback(null, isAllowedOrigin(origin));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/api/cheques", chequeRoutes);
app.use("/cheques", chequeRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
