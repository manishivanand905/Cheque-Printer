require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const TARGET_EMAIL = "shivanand128510@gmail.com";
const NEW_PASSWORD = "Shiva1285@";

async function run() {
  await connectDB();

  const user = await User.findOne({ email: TARGET_EMAIL });

  if (!user) {
    console.log(`No user found with email: ${TARGET_EMAIL}`);
    console.log("Listing all users in DB:");
    const all = await User.find({}, "email name");
    console.log(all.length ? all : "  (no users at all)");
    process.exit(1);
  }

  console.log(`Found user: ${user.name} <${user.email}>`);

  user.password = await bcrypt.hash(NEW_PASSWORD, 10);
  await user.save();

  console.log("Password reset successfully. You can now log in.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
