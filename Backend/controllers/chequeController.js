const ChequeRecord = require("../models/ChequeRecord");

function normalizePayload(payload = {}, source = "single") {
  const bank = `${payload.bank || ""}`.trim().toUpperCase();
  const chequeNo = `${payload.chequeNo || ""}`.trim() || undefined;
  const payee = `${payload.payee || ""}`.trim();
  const amount = Number(payload.amount);
  const date = `${payload.date || ""}`.trim();

  if (!bank) throw new Error("Bank is required.");
  if (!payee) throw new Error("Payee name is required.");
  if (!date) throw new Error("Cheque date is required.");
  if (Number.isNaN(amount) || amount <= 0) {
    throw new Error("Amount must be a valid number greater than zero.");
  }

  return {
    bank,
    chequeNo,
    payee,
    amount,
    date,
    acPayee: Boolean(payload.acPayee),
    source,
  };
}

async function upsertRecord(payload, source) {
  const normalized = normalizePayload(payload, source);
  const userId = payload.userId;
  const now = new Date();
  const existing = normalized.chequeNo
    ? await ChequeRecord.findOne({
      user: userId,
      bank: normalized.bank,
      chequeNo: normalized.chequeNo,
    })
    : null;

  if (!existing) {
    return ChequeRecord.create({
      user: userId,
      ...normalized,
      firstPrintedAt: now,
      lastPrintedAt: now,
      printCount: 1,
    });
  }

  existing.payee = normalized.payee;
  existing.amount = normalized.amount;
  existing.date = normalized.date;
  existing.acPayee = normalized.acPayee;
  existing.source = normalized.source;
  existing.printCount += 1;
  existing.lastPrintedAt = now;

  return existing.save();
}

async function listCheques(req, res) {
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const search = `${req.query.search || ""}`.trim();
  const query = { user: req.user._id };

  if (search) {
    const expression = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { chequeNo: expression },
      { bank: expression },
      { payee: expression },
      { date: expression },
    ];
  }

  const records = await ChequeRecord.find(query)
    .sort({ lastPrintedAt: -1 })
    .limit(limit)
    .lean();

  res.json({
    count: records.length,
    data: records,
  });
}

async function createCheque(req, res) {
  const record = await upsertRecord(
    { ...req.body, userId: req.user._id },
    "single",
  );

  res.status(201).json({
    message: "Cheque saved successfully.",
    data: record,
  });
}

async function createBulkCheques(req, res) {
  const records = Array.isArray(req.body.records) ? req.body.records : [];

  if (!records.length) {
    res.status(400);
    throw new Error("At least one cheque record is required.");
  }

  const savedRecords = [];
  for (const record of records) {
    savedRecords.push(await upsertRecord(
      { ...record, userId: req.user._id },
      "bulk",
    ));
  }

  res.status(201).json({
    message: `${savedRecords.length} cheque records saved successfully.`,
    count: savedRecords.length,
    data: savedRecords,
  });
}

module.exports = {
  listCheques,
  createCheque,
  createBulkCheques,
};
