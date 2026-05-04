require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../config/db");

async function run() {
  await connectDB();
  const col = mongoose.connection.collection("chequerecords");

  const indexes = await col.indexes();
  console.log("Current indexes:", indexes.map((i) => i.name));

  // Drop any index that has chequeNo/bank but is NOT the correct partial one
  for (const idx of indexes) {
    const keys = Object.keys(idx.key || {});
    const isBadIndex =
      (keys.includes("chequeNo") || keys.includes("bank")) &&
      idx.name !== "_id_" &&
      !idx.partialFilterExpression;

    if (isBadIndex) {
      console.log(`Dropping bad index: ${idx.name}`);
      await col.dropIndex(idx.name);
    }
  }

  console.log("Done. Restart the backend server now.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
