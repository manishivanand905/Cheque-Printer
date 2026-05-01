import styled, { css } from "styled-components";

const addMm = (base, delta = 0) => `calc(${base || "0mm"} + ${delta}mm)`;
const subtractMm = (base, delta = 0) => `calc(${base || "0mm"} - ${delta}mm)`;

export const ChequeWrapper = styled.div`
  position: relative;
  display: block;
  width: ${({ $width }) => $width || "204mm"};
  height: ${({ $height }) => $height || "93mm"};
  background: #fffef8;
  border: 1px solid #ccc;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  font-family: "Times New Roman", Times, serif;

  @media print {
    background: #fffef8 !important;
    border: none;
    box-shadow: none;
    margin: 0;
    break-inside: avoid;
    page-break-inside: avoid;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

export const ChequeBackground = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  object-position: center;
  pointer-events: none;
  user-select: none;
  opacity: 1;

  @media print {
    display: none !important;
  }
`;

export const DateField = styled.div`
  position: absolute;
  z-index: 1;
  top: ${({ $top, $offsetY }) => addMm($top || "8mm", $offsetY)};
  ${({ $left, $right, $offsetX }) =>
    $left
      ? css`
          left: ${addMm($left, $offsetX)};
          right: auto;
        `
      : css`
          right: ${subtractMm($right || "12mm", $offsetX)};
          left: auto;
        `}
  width: ${({ $width }) => $width || "34mm"};
  height: ${({ $height }) => $height || "5mm"};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
  font-size: ${({ $fontSize }) => $fontSize || "11pt"};
  font-weight: bold;
  color: #111;

  span {
    flex: 0 0 ${({ $charWidth }) => $charWidth || "3mm"};
    width: ${({ $charWidth }) => $charWidth || "3mm"};
    margin-right: ${({ $gap }) => $gap || "0mm"};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span:last-child {
    margin-right: 0;
  }
`;

export const AcPayeeStamp = styled.div`
  position: absolute;
  z-index: 1;
  top: ${({ $top, $offsetY }) => addMm($top || "18mm", $offsetY)};
  left: ${({ $left, $offsetX }) => addMm($left || "14mm", $offsetX)};
  transform: rotate(-45deg);
  transform-origin: center center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1mm;
  padding: -1mm 3mm;
  font-size: 7pt;
  font-weight: bold;
  color: #111;
  line-height: 1.3;
  text-align: center;

  span:first-child {
    border-top: 1.5px solid #111;
    padding-top: 1mm;
    width: 100%;
    text-align: center;
  }

  span:last-child {
    border-bottom: 1.5px solid #111;
    padding-bottom: 1mm;
    width: 100%;
    text-align: center;
  }
`;

export const PayeeLine = styled.div`
  position: absolute;
  z-index: 1;
  top: ${({ $top, $offsetY }) => addMm($top || "26mm", $offsetY)};
  left: ${({ $left, $offsetX }) => addMm($left || "28mm", $offsetX)};
  width: ${({ $width }) => $width || "150mm"};
  height: ${({ $height }) => $height || "5mm"};
  border-bottom: ${({ $showGuideLine }) =>
    $showGuideLine === false ? "none" : "1px solid #555"};
  font-size: ${({ $fontSize }) => $fontSize || "11pt"};
  font-weight: bold;
  color: #111;
  padding-bottom: ${({ $showGuideLine }) =>
    $showGuideLine === false ? "0" : "0.5mm"};
  line-height: ${({ $height }) => $height || "5mm"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AmountWordsField = styled.div`
  position: absolute;
  z-index: 1;
  top: ${({ $top, $offsetY }) => addMm($top || "41mm", $offsetY)};
  left: ${({ $left, $offsetX }) => addMm($left || "20mm", $offsetX)};
  width: ${({ $width }) => $width || "125mm"};
  min-height: ${({ $height }) => $height || "15mm"};
  font-size: ${({ $fontSize }) => $fontSize || "10pt"};
  font-weight: bold;
  color: #111;
  line-height: 1.4;
  border-bottom: ${({ $showGuideLine }) =>
    $showGuideLine === false ? "none" : "1px solid #555"};
  padding-bottom: ${({ $showGuideLine }) =>
    $showGuideLine === false ? "0" : "0.5mm"};
  word-break: break-word;
`;

export const AmountBox = styled.div`
  position: absolute;
  z-index: 1;
  top: ${({ $top, $offsetY }) => addMm($top || "40mm", $offsetY)};
  ${({ $left, $right, $offsetX }) =>
    $left
      ? css`
          left: ${addMm($left, $offsetX)};
          right: auto;
        `
      : css`
          right: ${subtractMm($right || "12mm", $offsetX)};
          left: auto;
        `}
  width: ${({ $width }) => $width || "auto"};
  height: ${({ $height }) => $height || "8mm"};
  min-width: ${({ $minWidth }) => $minWidth || "28mm"};
  border: ${({ $showBorder }) =>
    $showBorder === false ? "none" : "1.5px solid #111"};
  padding: ${({ $showBorder }) => ($showBorder === false ? "0" : "1mm 2mm")};
  font-size: ${({ $fontSize }) => $fontSize || "12pt"};
  font-weight: bold;
  color: #111;
  text-align: right;
  background: ${({ $showBorder }) =>
    $showBorder === false ? "transparent" : "#fffef8"};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1mm;
`;

export const MicrBar = styled.div`
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
  right: 0;
  height: 14mm;
  background: transparent;
  border-top: 1px dashed #bbb;
  display: flex;
  align-items: center;
  padding: 0 8mm;
  font-family: "MICR", "Courier New", monospace;
  font-size: 13pt;
  color: #222;
  letter-spacing: 2px;

  @media print {
    display: none;
  }
`;

export const SignatureLine = styled.div`
  position: absolute;
  z-index: 1;
  bottom: ${({ $offsetY }) => addMm("18mm", -$offsetY)};
  right: ${({ $offsetX }) => subtractMm("18mm", $offsetX)};
  width: 50mm;
  border-top: 1px solid #555;
  text-align: center;
  font-size: 7pt;
  color: #555;
  padding-top: 0.5mm;
`;

export const SignatureImage = styled.img`
  position: absolute;
  z-index: 1;
  bottom: ${({ $offsetY }) => addMm("19mm", -$offsetY)};
  right: ${({ $offsetX }) => subtractMm("18mm", $offsetX)};
  width: 50mm;
  height: 14mm;
  object-fit: contain;
`;
