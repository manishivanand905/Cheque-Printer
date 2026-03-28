import React from "react";
import {
  ChequeWrapper,
  DateField,
  AcPayeeStamp,
  PayeeLine,
  AmountWordsField,
  AmountBox,
  MicrBar,
  SignatureLine,
  SignatureImage,
} from "./ChequeLayoutStyles";
import {
  numberToWordsIndian,
  formatIndianNumber,
} from "../../utils/numberToWords";
import bankTemplates from "../../templates/bankTemplates";

function ChequeLayout({ data }) {
  const {
    bank,
    payee,
    amount,
    date,
    acPayee,
    signatureImg,
    offsetX = 0,
    offsetY = 0,
  } = data;
  const template = bankTemplates[bank] || bankTemplates.SBI;
  const horizontalOffset = Number(offsetX) || 0;
  const verticalOffset = Number(offsetY) || 0;

  const amountWords = numberToWordsIndian(amount);
  const amountFormatted = amount
    ? formatIndianNumber(parseFloat(amount).toFixed(2))
    : "";

  const dateDisplay = date ? date.split("-").reverse().join("") : "________";

  return (
    <ChequeWrapper>
      <DateField
        $top={template.dateTop}
        $right={template.dateRight}
        $width={template.dateWidth}
        $offsetX={horizontalOffset}
        $offsetY={verticalOffset}
      >
        {dateDisplay.split("").map((char, index) => (
          <span key={`${char}-${index}`}>{char}</span>
        ))}
      </DateField>

      {acPayee && (
        <AcPayeeStamp
          $top={template.acPayeeTop}
          $left={template.acPayeeLeft}
          $offsetX={horizontalOffset}
          $offsetY={verticalOffset}
        >
          A/C PAYEE
        </AcPayeeStamp>
      )}

      <PayeeLine
        $top={template.payeeTop}
        $left={template.payeeLeft}
        $width={template.payeeWidth}
        $offsetX={horizontalOffset}
        $offsetY={verticalOffset}
      >
        {payee || ""}
      </PayeeLine>

      <AmountWordsField
        $top={template.amountWordsTop}
        $left={template.amountWordsLeft}
        $width={template.amountWordsWidth}
        $offsetX={horizontalOffset}
        $offsetY={verticalOffset}
      >
        {amountWords || ""}
      </AmountWordsField>

      <AmountBox
        $top={template.amountBoxTop}
        $right={template.amountBoxRight}
        $minWidth={template.amountBoxMinWidth}
        $offsetX={horizontalOffset}
        $offsetY={verticalOffset}
      >
        {template.showAmountPrefix !== false ? (
          <span style={{ fontSize: "10pt" }}>Rs.</span>
        ) : null}
        <span>{amountFormatted || "0.00"}</span>
      </AmountBox>

      {signatureImg ? (
        <SignatureImage
          src={signatureImg}
          alt="Signature"
          $offsetX={horizontalOffset}
          $offsetY={verticalOffset}
        />
      ) : null}
      <SignatureLine $offsetX={horizontalOffset} $offsetY={verticalOffset}>
        Authorised Signatory
      </SignatureLine>

      <MicrBar>
        <span style={{ opacity: 0.4, fontSize: "9pt", letterSpacing: "2px" }}>
          MICR ZONE - DO NOT PRINT
        </span>
      </MicrBar>
    </ChequeWrapper>
  );
}

export default ChequeLayout;
