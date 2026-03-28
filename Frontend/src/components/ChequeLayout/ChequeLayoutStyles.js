import styled from "styled-components";

const addMm = (base, delta = 0) => `calc(${base || "0mm"} + ${delta}mm)`;
const subtractMm = (base, delta = 0) => `calc(${base || "0mm"} - ${delta}mm)`;

export const ChequeWrapper = styled.div`
  position: relative;
  display: block;
  width: 202mm;
  height: 92mm;
  background: #fffef8;
  border: 1px solid #ccc;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  font-family: "Courier New", Courier, monospace;

  @media print {
    border: none;
    box-shadow: none;
    margin: 0;
    break-inside: avoid;
    page-break-inside: avoid;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

export const DateField = styled.div`
  position: absolute;
  top: ${({ $top, $offsetY }) => addMm($top || "9mm", $offsetY)};
  right: ${({ $right, $offsetX }) => subtractMm($right || "12mm", $offsetX)};
  width: ${({ $width }) => $width || "34mm"};
  display: flex;
  justify-content: space-between;
  font-size: 11pt;
  font-weight: bold;
  color: #111;

  span {
    min-width: 3mm;
    text-align: center;
  }
`;

export const AcPayeeStamp = styled.div`
  position: absolute;
  top: ${({ $top, $offsetY }) => addMm($top || "18mm", $offsetY)};
  left: ${({ $left, $offsetX }) => addMm($left || "14mm", $offsetX)};
  border: 2px solid #111;
  padding: 1mm 2mm;
  font-size: 7pt;
  font-weight: bold;
  color: #111;
  line-height: 1.3;
  text-align: center;
`;

export const PayeeLine = styled.div`
  position: absolute;
  top: ${({ $top, $offsetY }) => addMm($top || "26mm", $offsetY)};
  left: ${({ $left, $offsetX }) => addMm($left || "28mm", $offsetX)};
  width: ${({ $width }) => $width || "150mm"};
  border-bottom: 1px solid #555;
  font-size: 11pt;
  font-weight: bold;
  color: #111;
  padding-bottom: 0.5mm;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AmountWordsField = styled.div`
  position: absolute;
  top: ${({ $top, $offsetY }) => addMm($top || "41mm", $offsetY)};
  left: ${({ $left, $offsetX }) => addMm($left || "20mm", $offsetX)};
  width: ${({ $width }) => $width || "125mm"};
  font-size: 10pt;
  font-weight: bold;
  color: #111;
  line-height: 1.4;
  border-bottom: 1px solid #555;
  padding-bottom: 0.5mm;
  word-break: break-word;
`;

export const AmountBox = styled.div`
  position: absolute;
  top: ${({ $top, $offsetY }) => addMm($top || "40mm", $offsetY)};
  right: ${({ $right, $offsetX }) => subtractMm($right || "12mm", $offsetX)};
  min-width: ${({ $minWidth }) => $minWidth || "28mm"};
  border: 1.5px solid #111;
  padding: 1mm 2mm;
  font-size: 12pt;
  font-weight: bold;
  color: #111;
  text-align: right;
  background: #fffef8;
  display: flex;
  align-items: center;
  gap: 1mm;
`;

export const MicrBar = styled.div`
  position: absolute;
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
  bottom: ${({ $offsetY }) => addMm("19mm", -$offsetY)};
  right: ${({ $offsetX }) => subtractMm("18mm", $offsetX)};
  width: 50mm;
  height: 14mm;
  object-fit: contain;
`;
