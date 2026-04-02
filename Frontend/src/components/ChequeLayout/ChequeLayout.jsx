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
  const showGuideLines = template.showGuideLines !== false;
  const showAmountBoxBorder = template.showAmountBoxBorder !== false;
  const showSignatureGuide = template.showSignatureGuide !== false;
  const showMicrHint = template.showMicrHint !== false;

  const amountWords = numberToWordsIndian(amount);
  const amountFormatted = amount
    ? formatIndianNumber(parseFloat(amount).toFixed(2))
    : "";

  const dateDisplay = date ? date.split("-").reverse().join("") : "________";

  return (
    <ChequeWrapper
      $backgroundImage={template.backgroundImage}
      $width={template.chequeWidth}
      $height={template.chequeHeight}
    >
      <DateField
        $top={template.dateTop}
        $left={template.dateLeft}
        $right={template.dateRight}
        $width={template.dateWidth}
        $height={template.dateHeight}
        $gap={template.dateGap}
        $charWidth={template.dateCharWidth}
        $fontSize={template.dateFontSize}
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
        $height={template.payeeHeight}
        $fontSize={template.payeeFontSize}
        $showGuideLine={showGuideLines}
        $offsetX={horizontalOffset}
        $offsetY={verticalOffset}
      >
        {payee || ""}
      </PayeeLine>

      <AmountWordsField
        $top={template.amountWordsTop}
        $left={template.amountWordsLeft}
        $width={template.amountWordsWidth}
        $height={template.amountWordsHeight}
        $fontSize={template.amountWordsFontSize}
        $showGuideLine={showGuideLines}
        $offsetX={horizontalOffset}
        $offsetY={verticalOffset}
      >
        {amountWords || ""}
      </AmountWordsField>

      <AmountBox
        $top={template.amountBoxTop}
        $left={template.amountBoxLeft}
        $right={template.amountBoxRight}
        $width={template.amountBoxWidth}
        $height={template.amountBoxHeight}
        $minWidth={template.amountBoxMinWidth}
        $fontSize={template.amountBoxFontSize}
        $showBorder={showAmountBoxBorder}
        $offsetX={horizontalOffset}
        $offsetY={verticalOffset}
      >
        {template.showAmountPrefix !== false ? (
          <span style={{ fontSize: "10pt" }}></span>
        ) : null}
        <span>{amountFormatted || ""}</span>
      </AmountBox>

      {signatureImg ? (
        <SignatureImage
          src={signatureImg}
          alt="Signature"
          $offsetX={horizontalOffset}
          $offsetY={verticalOffset}
        />
      ) : null}
      {showSignatureGuide ? (
        <SignatureLine $offsetX={horizontalOffset} $offsetY={verticalOffset}>
          Authorised Signatory
        </SignatureLine>
      ) : null}

      {showMicrHint ? (
        <MicrBar>
          <span style={{ opacity: 0.4, fontSize: "9pt", letterSpacing: "2px" }}>
            MICR ZONE - DO NOT PRINT
          </span>
        </MicrBar>
      ) : null}
    </ChequeWrapper>
  );
}

export default ChequeLayout;
