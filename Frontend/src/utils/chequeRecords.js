export const today = new Date().toISOString().split("T")[0];

export function createDefaultChequeData() {
  return {
    bank: "SBI",
    chequeNo: "",
    payee: "",
    amount: "",
    date: today,
    offsetX: 0,
    offsetY: 0,
    acPayee: false,
    signatureImg: null,
  };
}

export function sanitizeChequeRecord(record = {}) {
  return {
    id: record.id || null,
    bank: `${record.bank || "SBI"}`.trim().toUpperCase(),
    chequeNo: `${record.chequeNo || ""}`.trim(),
    payee: `${record.payee || ""}`.trim(),
    amount: `${record.amount ?? ""}`.trim(),
    date: `${record.date || today}`.trim(),
    offsetX: Number(record.offsetX) || 0,
    offsetY: Number(record.offsetY) || 0,
    acPayee: Boolean(record.acPayee),
    signatureImg: record.signatureImg || null,
  };
}

export function validateChequeRecord(record) {
  const item = sanitizeChequeRecord(record);

  if (!item.chequeNo) return "Cheque number is required.";
  if (!item.payee) return "Payee name is required.";
  if (!item.amount || Number.isNaN(Number(item.amount)) || Number(item.amount) <= 0) {
    return "Enter a valid amount greater than zero.";
  }
  if (!item.date) return "Cheque date is required.";

  return "";
}

export function createBulkQueueEntry(record) {
  return {
    ...sanitizeChequeRecord(record),
    id: record.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
}

export function formatChequeDate(dateValue) {
  if (!dateValue) return "";

  const [year, month, day] = `${dateValue}`.split("-");
  if (!year || !month || !day) return `${dateValue}`;

  return `${day}/${month}/${year}`;
}

export function matchesHistorySearch(record, search) {
  if (!search) return true;

  const query = search.trim().toLowerCase();
  if (!query) return true;

  return [record.chequeNo, record.bank, record.payee, `${record.amount}`, record.date]
    .filter(Boolean)
    .some((value) => `${value}`.toLowerCase().includes(query));
}
