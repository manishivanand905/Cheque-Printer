import React from "react";
import {
  SectionLabel,
  FormGroup,
  FormGrid,
  Label,
  Input,
  FieldHint,
  BankGrid,
  BankButton,
  CheckboxRow,
  PrintButton,
  ButtonRow,
  SecondaryButton,
  GhostButton,
  Disclaimer,
  FileInputLabel,
} from "./InputFormStyles";
import bankTemplates from "../../templates/bankTemplates";

const BANKS = Object.keys(bankTemplates);

function InputForm({
  data,
  onChange,
  onPrint,
  onAddToBulk,
  onPrintBulk,
  onUploadBulk,
  onClearBulk,
  bulkCount,
  busy,
}) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleSignature = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) =>
      handleChange("signatureImg", loadEvent.target.result);
    reader.readAsDataURL(file);
  };

  const handleBulkFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await onUploadBulk(file);
    event.target.value = "";
  };

  return (
    <div>
      <SectionLabel>Bank</SectionLabel>
      <BankGrid>
        {BANKS.map((bankCode) => (
          <BankButton
            key={bankCode}
            $active={data.bank === bankCode}
            onClick={() => handleChange("bank", bankCode)}
            type="button"
          >
            {bankCode}
          </BankButton>
        ))}
      </BankGrid>

      <SectionLabel>Details</SectionLabel>

      <FormGroup>
        <Label>Cheque No.</Label>
        <Input
          type="text"
          placeholder="Cheque number"
          value={data.chequeNo}
          onChange={(event) => handleChange("chequeNo", event.target.value)}
        />
        <FieldHint>Saved in history only, not printed.</FieldHint>
      </FormGroup>

      <FormGroup>
        <Label>Payee</Label>
        <Input
          type="text"
          placeholder="Payee name"
          value={data.payee}
          onChange={(event) => handleChange("payee", event.target.value)}
        />
      </FormGroup>

      <FormGrid>
        <FormGroup>
          <Label>Amount</Label>
          <Input
            type="number"
            placeholder="12345.50"
            value={data.amount}
            min="0"
            onChange={(event) => handleChange("amount", event.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Date</Label>
          <Input
            type="date"
            value={data.date}
            onChange={(event) => handleChange("date", event.target.value)}
          />
        </FormGroup>
      </FormGrid>

      <SectionLabel>Adjust</SectionLabel>

      <FormGrid>
        <FormGroup>
          <Label>X (mm)</Label>
          <Input
            type="number"
            step="0.5"
            value={data.offsetX}
            onChange={(event) => handleChange("offsetX", event.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Y (mm)</Label>
          <Input
            type="number"
            step="0.5"
            value={data.offsetY}
            onChange={(event) => handleChange("offsetY", event.target.value)}
          />
        </FormGroup>
      </FormGrid>

      <SectionLabel>Options</SectionLabel>

      <CheckboxRow>
        <input
          type="checkbox"
          checked={data.acPayee}
          onChange={(event) => handleChange("acPayee", event.target.checked)}
        />
        A/C Payee
      </CheckboxRow>

      <FormGroup>
        <Label>Signature</Label>
        <FileInputLabel>
          {data.signatureImg ? "Signature loaded" : "Upload signature"}
          <input type="file" accept="image/*" onChange={handleSignature} />
        </FileInputLabel>
        {data.signatureImg && (
          <button
            onClick={() => handleChange("signatureImg", null)}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer",
              fontSize: "11px",
              marginTop: "4px",
            }}
            type="button"
          >
            Remove
          </button>
        )}
      </FormGroup>

      <PrintButton onClick={onPrint} type="button" disabled={busy}>
        {busy ? "Saving..." : "Save & Print"}
      </PrintButton>

      <ButtonRow>
        <SecondaryButton onClick={onAddToBulk} type="button" disabled={busy}>
          Add Bulk
        </SecondaryButton>
        <SecondaryButton
          onClick={onPrintBulk}
          type="button"
          disabled={busy || bulkCount === 0}
        >
          Bulk Print ({bulkCount})
        </SecondaryButton>
      </ButtonRow>

      <SectionLabel>Bulk</SectionLabel>

      <FormGroup>
        <Label>Excel / CSV</Label>
        <FileInputLabel>
          Upload file
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleBulkFile}
          />
        </FileInputLabel>
        <FieldHint>Headers: cheque no, bank, payee, amount, date, ac payee.</FieldHint>
      </FormGroup>

      <GhostButton
        onClick={onClearBulk}
        type="button"
        disabled={busy || bulkCount === 0}
      >
        Clear Bulk
      </GhostButton>

      <Disclaimer>
        Print with `Margins: None`, `Scale: 100%`, and turn off `Headers and
        footers`. Use X/Y to fine-tune.
      </Disclaimer>
    </div>
  );
}

export default InputForm;
