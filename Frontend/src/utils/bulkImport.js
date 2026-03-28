import * as XLSX from "xlsx";
import bankTemplates from "../templates/bankTemplates";
import { createBulkQueueEntry, today } from "./chequeRecords";

const HEADER_ALIASES = {
  chequeNo: ["chequeno", "chequenumber", "checkno", "checknumber", "cheque no"],
  bank: ["bank", "bankname"],
  payee: [
    "payee",
    "payeename",
    "name",
    "partyname",
    "beneficiary",
    "beneficiaryname",
  ],
  amount: ["amount", "amt", "amountinr", "amountrs"],
  date: ["date", "chequedate", "paymentdate"],
  acPayee: ["acpayee", "a/cpayee", "accountpayee", "crossed"],
};

function normalizeHeader(value) {
  return `${value || ""}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function mapHeader(header) {
  const normalized = normalizeHeader(header);

  return Object.entries(HEADER_ALIASES).find(([, aliases]) =>
    aliases.some((alias) => normalizeHeader(alias) === normalized),
  )?.[0];
}

function normalizeBoolean(value, fallback) {
  if (value === "" || value === null || value === undefined) return fallback;
  if (typeof value === "boolean") return value;

  const normalized = `${value}`.trim().toLowerCase();
  return ["yes", "true", "1", "y"].includes(normalized);
}

function toIsoDateString(value) {
  if (!value) return today;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) {
      const month = `${parsed.m}`.padStart(2, "0");
      const day = `${parsed.d}`.padStart(2, "0");
      return `${parsed.y}-${month}-${day}`;
    }
  }

  const raw = `${value}`.trim();
  if (!raw) return today;

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const slashMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return today;
}

function normalizeBank(value, fallbackBank) {
  const candidate = `${value || fallbackBank || "SBI"}`.trim().toUpperCase();
  return bankTemplates[candidate] ? candidate : fallbackBank || "SBI";
}

export async function parseBulkFile(file, defaults = {}) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) return [];

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], {
    defval: "",
  });

  return rows
    .map((row) => {
      const mappedRow = Object.entries(row).reduce((accumulator, [key, value]) => {
        const targetKey = mapHeader(key);
        if (targetKey) accumulator[targetKey] = value;
        return accumulator;
      }, {});

      return createBulkQueueEntry({
        bank: normalizeBank(mappedRow.bank, defaults.bank),
        chequeNo: mappedRow.chequeNo,
        payee: mappedRow.payee,
        amount: mappedRow.amount === "" ? "" : `${mappedRow.amount}`,
        date: toIsoDateString(mappedRow.date || defaults.date),
        acPayee: normalizeBoolean(mappedRow.acPayee, defaults.acPayee),
        offsetX: defaults.offsetX,
        offsetY: defaults.offsetY,
        signatureImg: defaults.signatureImg,
      });
    })
    .filter((row) => row.chequeNo || row.payee || row.amount);
}
