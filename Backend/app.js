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

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS."));
    },
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cheques", chequeRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
