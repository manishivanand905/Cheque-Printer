const mongoose = require("mongoose");
let cachedConnectionPromise = null;

function normalizeEnvValue(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function readEnv(...keys) {
  for (const key of keys) {
    const value = normalizeEnvValue(process.env[key]);
    if (value) {
      return value;
    }
  }

  return "";
}

function joinQueryParams(params) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}`.trim() !== "") {
      search.set(key, `${value}`.trim());
    }
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

function buildMongoUriFromParts() {
  const hosts = readEnv("MONGODB_HOSTS", "MONGO_HOSTS", "MONGODB_HOST");
  const username = readEnv("MONGODB_USERNAME", "MONGO_USERNAME");
  const password = readEnv("MONGODB_PASSWORD", "MONGO_PASSWORD");

  if (!hosts || !username || !password) {
    return "";
  }

  const protocol = readEnv("MONGODB_PROTOCOL", "MONGO_PROTOCOL") || "mongodb+srv";
  const databaseName =
    readEnv("MONGODB_DB_NAME", "MONGO_DB_NAME", "MONGODB_DATABASE", "MONGO_DATABASE") ||
    "cheque_printer";
  const authSource = readEnv("MONGODB_AUTHSOURCE", "MONGO_AUTHSOURCE") || "admin";
  const replicaSet = readEnv("MONGODB_REPLICA_SET", "MONGO_REPLICA_SET");
  const extraOptions = readEnv("MONGODB_OPTIONS", "MONGO_OPTIONS");

  const baseQuery = joinQueryParams({
    authSource,
    retryWrites: "true",
    w: "majority",
    replicaSet,
  });

  const extraQuery = extraOptions
    ? `${baseQuery ? "&" : "?"}${extraOptions.replace(/^\?/, "")}`
    : "";

  return (
    `${protocol}://` +
    `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` +
    `${hosts}/${databaseName}${baseQuery}${extraQuery}`
  );
}

function resolveMongoUri() {
  return (
    buildMongoUriFromParts() ||
    readEnv("MONGODB_URI", "MONGO_URI", "DATABASE_URL", "MONGODB_URL")
  );
}

function describeMongoUri(mongoUri) {
  if (typeof mongoUri !== "string") {
    return "MongoDB URI unavailable";
  }

  const trimmed = mongoUri.trim();
  const protocolSeparatorIndex = trimmed.indexOf("://");

  if (protocolSeparatorIndex === -1) {
    return "MongoDB URI format not recognized";
  }

  const protocol = trimmed.slice(0, protocolSeparatorIndex + 3);
  const remainder = trimmed.slice(protocolSeparatorIndex + 3);
  const credentialsSeparatorIndex = remainder.lastIndexOf("@");
  const hostAndPath = credentialsSeparatorIndex === -1
    ? remainder
    : remainder.slice(credentialsSeparatorIndex + 1);
  const [hostPart, pathAndQuery = ""] = hostAndPath.split("/", 2);
  const databaseName = pathAndQuery.split("?")[0] || "(default)";

  if (!hostPart) {
    return "MongoDB URI format not recognized";
  }

  return `${protocol}${hostPart}/${databaseName}`;
}

const connectDB = async () => {
  const mongoUri = resolveMongoUri();

  if (!mongoUri) {
    throw new Error(
      "MongoDB config is missing. Set MONGODB_URI or provide MONGODB_HOSTS, MONGODB_USERNAME, and MONGODB_PASSWORD.",
    );
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnectionPromise) {
    return cachedConnectionPromise;
  }

  try {
    cachedConnectionPromise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 15000,
      })
      .then(() => {
        console.log("MongoDB connected");
        return mongoose.connection;
      })
      .catch((error) => {
        cachedConnectionPromise = null;

        if (error?.code === 8000 || /authentication failed/i.test(error?.message || "")) {
          throw new Error(
            "MongoDB authentication failed. On Render, verify the Atlas credentials in MONGODB_URI or set MONGODB_HOSTS, MONGODB_USERNAME, MONGODB_PASSWORD, and optionally MONGODB_DB_NAME. If your password has special characters, use the separate username/password env vars so it is encoded safely.",
          );
        }

        throw error;
      });

    return await cachedConnectionPromise;
  } catch (error) {
    cachedConnectionPromise = null;

    if (error?.code === 8000 || /authentication failed/i.test(error?.message || "")) {
      throw new Error(
        "MongoDB authentication failed. On Render, verify the Atlas credentials in MONGODB_URI or set MONGODB_HOSTS, MONGODB_USERNAME, MONGODB_PASSWORD, and optionally MONGODB_DB_NAME. If your password has special characters, use the separate username/password env vars so it is encoded safely.",
      );
    }

    throw error;
  }
};

module.exports = connectDB;
