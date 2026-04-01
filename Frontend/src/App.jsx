import React, { useCallback, useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import ChequeLayout from "./components/ChequeLayout/ChequeLayout";
import InputForm from "./components/InputForm/InputForm";
import AuthPanel from "./components/Auth/AuthPanel";
import {
  AppShell,
  Header,
  LogoMark,
  HeaderTitle,
  MainLayout,
  FormPanel,
  PreviewPanel,
  PreviewTitle,
  PreviewBox,
  AmountWordsBadge,
} from "./components/InputForm/InputFormStyles";
import { numberToWordsIndian } from "./utils/numberToWords";
import { parseBulkFile } from "./utils/bulkImport";
import {
  createBulkQueueEntry,
  createDefaultChequeData,
  formatChequeDate,
  matchesHistorySearch,
  sanitizeChequeRecord,
  validateChequeRecord,
} from "./utils/chequeRecords";
import {
  clearStoredAuth,
  fetchChequeHistory,
  fetchCurrentUser,
  loginUser,
  readStoredAuth,
  registerUser,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  saveBulkChequeRecords,
  saveChequeRecord,
  setStoredAuth,
} from "./services/chequeApi";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f1117; }

  @media print {
    html, body, #root {
      width: 204mm;
      min-height: 93mm;
      overflow: visible;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      background: white;
      color: #111;
    }

    .no-print { display: none !important; }
    .print-only { display: block !important; }
    .print-root { display: block !important; }

    .app-shell,
    .app-layout,
    .preview-panel,
    .print-root,
    .print-sheet {
      width: 204mm !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      gap: 0 !important;
      overflow: visible !important;
    }

    .app-layout,
    .preview-panel {
      display: block !important;
    }

    .print-sheet {
      height: 93mm !important;
      page-break-after: always;
      break-after: page;
    }

    .print-sheet:last-child {
      page-break-after: auto;
      break-after: auto;
    }

    @page {
      size: 204mm 93mm;
      margin: 0;
    }
  }
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 22px;
`;

const StatusBanner = styled.div`
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid
    ${({ $tone }) =>
      $tone === "error" ? "rgba(255, 124, 124, 0.4)" : "rgba(104, 205, 156, 0.35)"};
  background: ${({ $tone }) =>
    $tone === "error" ? "rgba(120, 24, 24, 0.28)" : "rgba(28, 92, 63, 0.22)"};
  color: ${({ $tone }) => ($tone === "error" ? "#ffd6d6" : "#dff7ea")};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const SectionCard = styled.section`
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.03);
`;

const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  h3 {
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #fff0c5;
  }

  span {
    color: rgba(244, 239, 230, 0.62);
    font-size: 0.84rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 11px 13px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  color: #fff9ef;

  &:focus {
    outline: none;
    border-color: rgba(241, 201, 107, 0.8);
  }
`;

const DataTableWrap = styled.div`
  overflow-x: auto;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 620px;

  th,
  td {
    padding: 10px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    text-align: left;
    color: #f5efe1;
    font-size: 0.88rem;
    vertical-align: top;
  }

  th {
    color: rgba(244, 239, 230, 0.64);
    font-weight: 700;
    font-size: 0.76rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

const MiniButton = styled.button`
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(241, 201, 107, 0.28);
  background: rgba(241, 201, 107, 0.08);
  color: #f8e7bc;
  font-size: 0.82rem;
  cursor: pointer;

  &:hover {
    border-color: rgba(241, 201, 107, 0.55);
  }
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(241, 201, 107, 0.28);
  background: rgba(241, 201, 107, 0.08);
  color: #f8e7bc;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(241, 201, 107, 0.6);
    background: rgba(241, 201, 107, 0.14);
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(5, 8, 13, 0.7);
  backdrop-filter: blur(12px);
`;

const ModalCard = styled.div`
  width: min(1080px, 100%);
  max-height: calc(100vh - 48px);
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 26px;
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(241, 201, 107, 0.16), transparent 34%),
    rgba(12, 15, 22, 0.97);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.45);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;

  h3 {
    color: #fff0c5;
    font-size: 1rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  p {
    color: rgba(244, 239, 230, 0.62);
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const CloseButton = styled.button`
  padding: 9px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #f5efe1;
  cursor: pointer;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PreviewFrame = styled.div`
  border-radius: 22px;
  padding: 10px 14px 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)),
    rgba(255, 255, 255, 0.02);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewScaler = styled.div`
  width: fit-content;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.82);
  transform-origin: top center;

  @media (max-width: 720px) {
    transform: scale(0.6);
    margin-left: -58px;
    margin-right: -58px;
  }
`;

const DetailPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DetailCard = styled.div`
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  min-height: 72px;
`;

const DetailLabel = styled.div`
  color: rgba(244, 239, 230, 0.58);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
`;

const DetailValue = styled.div`
  color: #f5efe1;
  font-size: 0.92rem;
  line-height: 1.35;
  word-break: break-word;
`;

const EmptyState = styled.p`
  color: rgba(244, 239, 230, 0.64);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const PrintHidden = styled.div`
  display: none;
`;

const HeaderActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserPill = styled.div`
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: #f3ead7;
  font-size: 0.82rem;
  line-height: 1.35;
`;

const LogoutButton = styled.button`
  padding: 10px 12px;
  border: 1px solid rgba(241, 201, 107, 0.35);
  border-radius: 14px;
  background: rgba(241, 201, 107, 0.08);
  color: #f8e7bc;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
`;

const AuthShell = styled.div`
  width: min(1180px, 100%);
  margin: 0 auto;
`;

const AuthMessageCard = styled.div`
  margin-top: 18px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  background: rgba(11, 14, 20, 0.76);
  color: rgba(244, 239, 230, 0.75);
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: center;
`;

function mergeQueueEntries(existingEntries, newEntries) {
  const map = new Map();

  [...existingEntries, ...newEntries].forEach((entry) => {
    const normalized = createBulkQueueEntry(entry);
    const key = `${normalized.bank}-${normalized.chequeNo}`;
    map.set(key, normalized);
  });

  return Array.from(map.values());
}

function App() {
  const [data, setData] = useState(createDefaultChequeData);
  const [bulkEntries, setBulkEntries] = useState([]);
  const [history, setHistory] = useState([]);
  const [historySearch, setHistorySearch] = useState("");
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState(null);
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState("success");
  const [busy, setBusy] = useState(false);
  const [printBatch, setPrintBatch] = useState([]);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    bootstrapAuth();
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => setPrintBatch([]);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  useEffect(() => {
    if (!selectedHistoryRecord) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedHistoryRecord(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedHistoryRecord]);

  async function bootstrapAuth() {
    const stored = readStoredAuth();

    if (!stored?.token) {
      setAuthReady(true);
      return;
    }

    try {
      const response = await fetchCurrentUser();
      setUser(response.user);
    } catch (error) {
      clearStoredAuth();
    } finally {
      setAuthReady(true);
    }
  }

  const loadHistory = useCallback(async () => {
    try {
      const response = await fetchChequeHistory();
      setHistory(response.data || []);
    } catch (error) {
      if (error.message.toLowerCase().includes("token")) {
        clearStoredAuth();
        setUser(null);
        setPrintBatch([]);
      }
      setStatusTone("error");
      setStatus(
        `History could not load from the backend yet. ${error.message}`,
      );
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadHistory();
    } else {
      setHistory([]);
      setBulkEntries([]);
    }
  }, [user, loadHistory]);

  function showMessage(message, tone = "success") {
    setStatusTone(tone);
    setStatus(message);
  }

  function handleAuthSuccess(response, successMessage) {
    setStoredAuth({
      token: response.token,
      user: response.user,
    });
    setUser(response.user);
    showMessage(successMessage);
  }

  async function handleRegister(payload) {
    setBusy(true);
    try {
      const response = await registerUser(payload);
      handleAuthSuccess(response, "Account created and logged in successfully.");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin(payload) {
    setBusy(true);
    try {
      const response = await loginUser(payload);
      handleAuthSuccess(response, "Logged in successfully.");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleRequestOtp(email) {
    setBusy(true);
    try {
      const response = await requestPasswordResetOtp({ email });
      showMessage(response.message);
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleResetPassword(payload) {
    setBusy(true);
    try {
      const response = await resetPasswordWithOtp(payload);
      showMessage(response.message);
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    clearStoredAuth();
    setUser(null);
    setPrintBatch([]);
    showMessage("Logged out successfully.");
  }

  async function openPrintDialog(records) {
    setPrintBatch(records);
    setTimeout(() => window.print(), 80);
  }

  async function handlePrintSingle() {
    if (!user) {
      showMessage("Please log in before printing cheques.", "error");
      return;
    }

    const errorMessage = validateChequeRecord(data);
    if (errorMessage) {
      showMessage(errorMessage, "error");
      return;
    }

    const record = sanitizeChequeRecord(data);
    setBusy(true);

    try {
      await saveChequeRecord(record);
      await loadHistory();
      showMessage(`Cheque ${record.chequeNo} saved and ready to print.`);
      await openPrintDialog([record]);
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  function handleAddToBulk() {
    if (!user) {
      showMessage("Please log in before managing bulk cheque printing.", "error");
      return;
    }

    const errorMessage = validateChequeRecord(data);
    if (errorMessage) {
      showMessage(errorMessage, "error");
      return;
    }

    const record = createBulkQueueEntry(data);
    setBulkEntries((current) => mergeQueueEntries(current, [record]));
    showMessage(`Cheque ${record.chequeNo} added to the bulk list.`);
  }

  async function handleUploadBulk(file) {
    if (!user) {
      showMessage("Please log in before uploading bulk cheques.", "error");
      return;
    }

    setBusy(true);

    try {
      const records = await parseBulkFile(file, data);
      if (!records.length) {
        showMessage("No valid cheque rows were found in the uploaded file.", "error");
        return;
      }

      setBulkEntries((current) => mergeQueueEntries(current, records));
      showMessage(`${records.length} cheque rows imported into the bulk list.`);
    } catch (error) {
      showMessage(`Bulk import failed. ${error.message}`, "error");
    } finally {
      setBusy(false);
    }
  }

  async function handlePrintBulk() {
    if (!user) {
      showMessage("Please log in before printing bulk cheques.", "error");
      return;
    }

    if (!bulkEntries.length) {
      showMessage("Add at least one cheque to the bulk list first.", "error");
      return;
    }

    const invalidRecord = bulkEntries.find((entry) => validateChequeRecord(entry));
    if (invalidRecord) {
      showMessage(
        `Cheque ${invalidRecord.chequeNo || "(missing number)"} needs complete data before bulk printing.`,
        "error",
      );
      return;
    }

    const records = bulkEntries.map((entry) => sanitizeChequeRecord(entry));
    setBusy(true);

    try {
      await saveBulkChequeRecords(records);
      await loadHistory();
      showMessage(`${records.length} cheques saved and sent to bulk print.`);
      await openPrintDialog(records);
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  function handleLoadQueueEntry(entry) {
    setData((current) => ({
      ...current,
      ...sanitizeChequeRecord(entry),
    }));
    showMessage(`Loaded cheque ${entry.chequeNo} into the editor.`);
  }

  function handleRemoveQueueEntry(entryId) {
    setBulkEntries((current) => current.filter((entry) => entry.id !== entryId));
  }

  function handleOpenHistoryPreview(record) {
    setSelectedHistoryRecord(record);
  }

  function handleCloseHistoryPreview() {
    setSelectedHistoryRecord(null);
  }

  const filteredHistory = history.filter((record) =>
    matchesHistorySearch(record, historySearch),
  );
  const amountWords = numberToWordsIndian(data.amount);
  const recordsToPrint = printBatch.length ? printBatch : [sanitizeChequeRecord(data)];
  const selectedHistoryAmountWords = selectedHistoryRecord
    ? numberToWordsIndian(selectedHistoryRecord.amount)
    : "";

  return (
    <>
      <GlobalStyle />
      <AppShell className="app-shell">
        <Header className="no-print">
          <LogoMark>IN</LogoMark>
          <HeaderTitle>
            <h1>Indian Cheque Printer</h1>
            <p>
              CTS-2026 Compliant | SBI | Indian | HDFC | ICICI | Axis | PNB |
              KVB
            </p>
          </HeaderTitle>
          {user ? (
            <HeaderActions>
              <UserPill>
                <strong>{user.name}</strong>
                <br />
                {user.email}
              </UserPill>
              <LogoutButton type="button" onClick={handleLogout}>
                Logout
              </LogoutButton>
            </HeaderActions>
          ) : null}
        </Header>

        {!authReady ? (
          <AuthShell>
            <AuthMessageCard>Checking your login session...</AuthMessageCard>
          </AuthShell>
        ) : !user ? (
          <AuthShell className="no-print">
            {status ? (
              <StatusBanner $tone={statusTone} style={{ marginBottom: "18px" }}>
                {status}
              </StatusBanner>
            ) : null}
            <AuthPanel
              onRegister={handleRegister}
              onLogin={handleLogin}
              onRequestOtp={handleRequestOtp}
              onResetPassword={handleResetPassword}
              busy={busy}
            />
            <AuthMessageCard>
              Login is required before printing cheques or viewing print history.
              Each user sees only their own cheque records.
            </AuthMessageCard>
          </AuthShell>
        ) : (
          <MainLayout className="app-layout">
            <FormPanel className="no-print">
              <InputForm
                data={data}
                onChange={setData}
                onPrint={handlePrintSingle}
                onAddToBulk={handleAddToBulk}
                onPrintBulk={handlePrintBulk}
                onUploadBulk={handleUploadBulk}
                onClearBulk={() => setBulkEntries([])}
                bulkCount={bulkEntries.length}
                busy={busy}
              />
            </FormPanel>

            <PreviewPanel className="preview-panel">
              <PreviewTitle className="no-print">Live Preview</PreviewTitle>
              <PreviewBox className="no-print">
                <div
                  style={{
                    transform: "scale(0.85)",
                    transformOrigin: "top center",
                  }}
                >
                  <ChequeLayout data={data} />
                </div>
                {amountWords ? (
                  <AmountWordsBadge>"{amountWords}"</AmountWordsBadge>
                ) : null}
              </PreviewBox>

              <Stack className="no-print">
                {status ? (
                  <StatusBanner $tone={statusTone}>{status}</StatusBanner>
                ) : null}

                <SectionCard>
                  <SectionHeading>
                    <h3>Bulk Queue</h3>
                    <span>{bulkEntries.length} cheque(s) ready</span>
                  </SectionHeading>

                  {bulkEntries.length ? (
                    <DataTableWrap>
                      <DataTable>
                        <thead>
                          <tr>
                            <th>Cheque No</th>
                            <th>Bank</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bulkEntries.map((entry) => (
                            <tr key={entry.id}>
                              <td>{entry.chequeNo}</td>
                              <td>{entry.bank}</td>
                              <td>{entry.payee}</td>
                              <td>{entry.amount}</td>
                              <td>{formatChequeDate(entry.date)}</td>
                              <td style={{ display: "flex", gap: "8px" }}>
                                <MiniButton
                                  type="button"
                                  onClick={() => handleLoadQueueEntry(entry)}
                                >
                                  Load
                                </MiniButton>
                                <MiniButton
                                  type="button"
                                  onClick={() => handleRemoveQueueEntry(entry.id)}
                                >
                                  Remove
                                </MiniButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </DataTable>
                    </DataTableWrap>
                  ) : (
                    <EmptyState>
                      Add cheques manually or upload an Excel file to prepare a
                      bulk print batch.
                    </EmptyState>
                  )}
                </SectionCard>

                <SectionCard>
                  <SectionHeading>
                    <h3>Print History</h3>
                    <span>{user.email}</span>
                  </SectionHeading>

                  <SearchInput
                    type="text"
                    placeholder="Search by cheque number, bank, payee, date..."
                    value={historySearch}
                    onChange={(event) => setHistorySearch(event.target.value)}
                  />

                  {filteredHistory.length ? (
                    <DataTableWrap>
                      <DataTable>
                        <thead>
                          <tr>
                            <th>Cheque No</th>
                            <th>Bank</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Printed</th>
                            <th>View</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredHistory.map((record) => (
                            <tr key={record._id}>
                              <td>{record.chequeNo}</td>
                              <td>{record.bank}</td>
                              <td>{record.payee}</td>
                              <td>{record.amount}</td>
                              <td>{formatChequeDate(record.date)}</td>
                              <td>{new Date(record.lastPrintedAt).toLocaleString()}</td>
                              <td>
                                <IconButton
                                  type="button"
                                  onClick={() => handleOpenHistoryPreview(record)}
                                  aria-label={`View cheque ${record.chequeNo}`}
                                  title="View cheque preview"
                                >
                                  <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M2 12C4.4 7.8 8 5.7 12 5.7C16 5.7 19.6 7.8 22 12C19.6 16.2 16 18.3 12 18.3C8 18.3 4.4 16.2 2 12Z"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                    />
                                    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                                  </svg>
                                </IconButton>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </DataTable>
                    </DataTableWrap>
                  ) : (
                    <EmptyState>
                      No cheque history found for this user yet. Once you save
                      and print, your own record will appear here.
                    </EmptyState>
                  )}
                </SectionCard>
              </Stack>

              <PrintHidden className="print-only print-root">
                {recordsToPrint.map((record, index) => (
                  <div className="print-sheet" key={`${record.chequeNo}-${index}`}>
                    <ChequeLayout data={record} />
                  </div>
                ))}
              </PrintHidden>
            </PreviewPanel>
          </MainLayout>
        )}
      </AppShell>

      {selectedHistoryRecord ? (
        <ModalBackdrop className="no-print" onClick={handleCloseHistoryPreview}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalHeader>
              <div>
                <h3>Cheque Preview</h3>
                <p>
                  Review the saved cheque layout and details for cheque no.{" "}
                  {selectedHistoryRecord.chequeNo}.
                </p>
              </div>
              <CloseButton type="button" onClick={handleCloseHistoryPreview}>
                Close
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <PreviewFrame>
                <PreviewScaler>
                  <ChequeLayout data={selectedHistoryRecord} />
                </PreviewScaler>
              </PreviewFrame>

              <DetailPanel>
                <DetailCard>
                  <DetailLabel>Name</DetailLabel>
                  <DetailValue>{selectedHistoryRecord.payee}</DetailValue>
                </DetailCard>

                <DetailCard>
                  <DetailLabel>Amount</DetailLabel>
                  <DetailValue>{selectedHistoryRecord.amount}</DetailValue>
                </DetailCard>

                <DetailCard>
                  <DetailLabel>Date</DetailLabel>
                  <DetailValue>{formatChequeDate(selectedHistoryRecord.date)}</DetailValue>
                </DetailCard>

                <DetailCard>
                  <DetailLabel>Bank</DetailLabel>
                  <DetailValue>{selectedHistoryRecord.bank}</DetailValue>
                </DetailCard>

                <DetailCard>
                  <DetailLabel>Printed At</DetailLabel>
                  <DetailValue>
                    {new Date(selectedHistoryRecord.lastPrintedAt).toLocaleString()}
                  </DetailValue>
                </DetailCard>

                {selectedHistoryAmountWords ? (
                  <DetailCard>
                    <DetailLabel>Amount In Words</DetailLabel>
                    <DetailValue>{selectedHistoryAmountWords}</DetailValue>
                  </DetailCard>
                ) : null}
              </DetailPanel>
            </ModalBody>
          </ModalCard>
        </ModalBackdrop>
      ) : null}
    </>
  );
}

export default App;
