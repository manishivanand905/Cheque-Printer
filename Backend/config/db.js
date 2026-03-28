const dns = require("node:dns");
const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  const dnsServers = (process.env.MONGODB_DNS_SERVERS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in Backend/.env");
  }

  if (mongoUri.startsWith("mongodb+srv://") && dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
}

module.exports = connectDB;
