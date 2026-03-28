const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, ".env"),
  quiet: true,
});

const app = require("./app");
const connectDB = require("./config/db");

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
