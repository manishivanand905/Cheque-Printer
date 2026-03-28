const path = require("path");
const dns = require("node:dns");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017/cheque_printer";
const BATCH_SIZE = 500;

function sanitizeIndexDefinition(index) {
  const {
    v,
    ns,
    background,
    key,
    name,
    ...options
  } = index;

  return {
    key,
    name,
    ...options,
  };
}

function getDbName(uri, fallbackName) {
  const parsed = new URL(uri);
  const pathname = parsed.pathname.replace(/^\//, "");

  if (pathname) {
    return decodeURIComponent(pathname);
  }

  if (fallbackName) {
    return fallbackName;
  }

  throw new Error(`Could not determine database name from URI: ${uri}`);
}

async function copyCollection(sourceDb, targetDb, collectionName, mode) {
  const sourceCollection = sourceDb.collection(collectionName);
  const targetCollection = targetDb.collection(collectionName);

  const sourceCount = await sourceCollection.countDocuments();
  const targetCount = await targetCollection.countDocuments();

  if (targetCount > 0 && mode !== "replace") {
    throw new Error(
      `Target collection "${collectionName}" already has ${targetCount} documents. ` +
        `Set MIGRATION_MODE=replace to overwrite it.`,
    );
  }

  if (targetCount > 0 && mode === "replace") {
    await targetCollection.drop();
  }

  if (sourceCount > 0) {
    const cursor = sourceCollection.find({});
    let batch = [];

    for await (const doc of cursor) {
      batch.push(doc);

      if (batch.length >= BATCH_SIZE) {
        await targetDb.collection(collectionName).insertMany(batch, { ordered: true });
        batch = [];
      }
    }

    if (batch.length > 0) {
      await targetDb.collection(collectionName).insertMany(batch, { ordered: true });
    }
  }

  const indexes = await sourceCollection.indexes();
  const secondaryIndexes = indexes
    .filter((index) => index.name !== "_id_")
    .map(sanitizeIndexDefinition);

  if (secondaryIndexes.length > 0) {
    await targetDb.collection(collectionName).createIndexes(secondaryIndexes);
  }

  const finalTargetCount = await targetDb.collection(collectionName).countDocuments();

  return {
    collectionName,
    sourceCount,
    targetCountBefore: targetCount,
    targetCountAfter: finalTargetCount,
  };
}

async function main() {
  const localUri = process.env.LOCAL_MONGODB_URI || DEFAULT_LOCAL_URI;
  const cloudUri = process.env.CLOUD_MONGODB_URI || process.env.MONGODB_URI;
  const migrationMode = (process.env.MIGRATION_MODE || "abort").toLowerCase();
  const dnsServers = (process.env.MONGODB_DNS_SERVERS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!cloudUri) {
    throw new Error("Cloud MongoDB URI is missing. Set MONGODB_URI or CLOUD_MONGODB_URI.");
  }

  if (localUri === cloudUri) {
    throw new Error("Local and cloud MongoDB URIs are identical. Refusing to migrate.");
  }

  if (cloudUri.startsWith("mongodb+srv://") && dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }

  const sourceDbName = getDbName(localUri, "cheque_printer");
  const targetDbName = getDbName(cloudUri, sourceDbName);
  const sourceClient = new MongoClient(localUri);
  const targetClient = new MongoClient(cloudUri);

  try {
    await sourceClient.connect();
    await targetClient.connect();

    const sourceDb = sourceClient.db(sourceDbName);
    const targetDb = targetClient.db(targetDbName);
    const collections = await sourceDb
      .listCollections({}, { nameOnly: true })
      .toArray();
    const userCollections = collections
      .map((collection) => collection.name)
      .filter((name) => !name.startsWith("system."));

    if (userCollections.length === 0) {
      console.log(`No collections found in local database "${sourceDbName}".`);
      return;
    }

    console.log(`Migrating ${userCollections.length} collection(s) from ${sourceDbName} to ${targetDbName}`);

    const results = [];

    for (const collectionName of userCollections) {
      const result = await copyCollection(sourceDb, targetDb, collectionName, migrationMode);
      results.push(result);
      console.log(
        `${collectionName}: local=${result.sourceCount}, cloudBefore=${result.targetCountBefore}, cloudAfter=${result.targetCountAfter}`,
      );
    }

    const mismatches = results.filter(
      (result) => result.sourceCount !== result.targetCountAfter,
    );

    if (mismatches.length > 0) {
      throw new Error(
        `Count mismatch after migration: ${mismatches
          .map((result) => result.collectionName)
          .join(", ")}`,
      );
    }

    console.log("Migration completed successfully.");
  } finally {
    await Promise.allSettled([sourceClient.close(), targetClient.close()]);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
