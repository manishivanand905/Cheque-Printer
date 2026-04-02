const bankExactLayout = {
  chequeWidth: "204mm",
  chequeHeight: "93mm",

  // DATE
  dateTop: "6mm",
  dateLeft: "155mm",
  dateWidth: "40mm",
  dateHeight: "5mm",
  dateCharWidth: "5mm",
  dateFontSize: "10pt",

  // PAYEE NAME
  payeeTop: "22mm",
  payeeLeft: "35mm",
  payeeWidth: "144mm",
  payeeHeight: "5mm",
  payeeFontSize: "11.5pt",

  // AMOUNT IN WORDS
  amountWordsTop: "32mm",
  amountWordsLeft: "35mm",
  amountWordsWidth: "144mm",
  amountWordsHeight: "15mm",
  amountWordsFontSize: "10pt",

  // AMOUNT BOX (FIGURES)
  amountBoxTop: "38mm",
  amountBoxLeft: "150mm",
  amountBoxWidth: "45mm",
  amountBoxHeight: "8mm",
  amountBoxFontSize: "12pt",

  // OPTIONAL FEATURES
  showAmountPrefix: true,
  showGuideLines: false,
  showAmountBoxBorder: false,

  // OPTIONAL ELEMENTS
  acPayeeTop: "17mm",
  acPayeeLeft: "12mm",

  showSignatureGuide: false,
  showMicrHint: false,
};

const bankTemplates = {
  SBI: {
    name: "State Bank of India",
    color: "#1a237e",
    accent: "#2196f3",
    backgroundImage: "/Images/sbi-cheque.jpg",
    ...bankExactLayout,
  },
  INDIAN: {
    name: "Indian Bank",
    color: "#0f5b78",
    accent: "#f0c02b",
    backgroundImage: "/Images/indian-cheque.jpg",
    ...bankExactLayout,
  },
  HDFC: {
    name: "HDFC Bank",
    color: "#004c8f",
    accent: "#e31837",
    backgroundImage: "/Images/hdfc-cheque.jpg",
    ...bankExactLayout,
  },
  ICICI: {
    name: "ICICI Bank",
    color: "#b71c1c",
    accent: "#f57c00",
    backgroundImage: "/Images/icici-cheque.jpg",
    ...bankExactLayout,
  },
  AXIS: {
    name: "Axis Bank",
    color: "#800020",
    accent: "#c62828",
    backgroundImage: "/Images/axis-cheque.jpg",
    ...bankExactLayout,
  },
  PNB: {
    name: "Punjab National Bank",
    color: "#1b5e20",
    accent: "#ff6f00",
    backgroundImage: "/Images/pnb-cheque.jpg",
    ...bankExactLayout,
  },
  KVB: {
    name: "Karur Vysya Bank",
    color: "#004b8d",
    accent: "#f5a623",
    backgroundImage: "/Images/kvb-cheque.jpg",
    ...bankExactLayout,
  },
};

export default bankTemplates;
