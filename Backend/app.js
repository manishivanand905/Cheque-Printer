const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const chequeRoutes = require("./routes/chequeRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
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
