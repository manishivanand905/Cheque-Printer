const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertHundreds(n) {
  let result = "";
  if (n >= 100) {
    result += ones[Math.floor(n / 100)] + " Hundred ";
    n = n % 100;
  }
  if (n >= 20) {
    result += tens[Math.floor(n / 10)] + " ";
    n = n % 10;
  }
  if (n > 0) {
    result += ones[n] + " ";
  }
  return result.trim();
}

export function numberToWordsIndian(amount) {
  if (!amount || isNaN(amount)) return "";

  const parts = parseFloat(amount).toFixed(2).split(".");
  let rupees = parseInt(parts[0]);
  const paise = parseInt(parts[1]);

  if (rupees === 0 && paise === 0) return "Zero Rupees Only";

  let words = "";

  if (rupees > 0) {
    const crore = Math.floor(rupees / 10000000);
    rupees = rupees % 10000000;
    const lakh = Math.floor(rupees / 100000);
    rupees = rupees % 100000;
    const thousand = Math.floor(rupees / 1000);
    rupees = rupees % 1000;
    const hundred = rupees;

    if (crore > 0) words += convertHundreds(crore) + " Crore ";
    if (lakh > 0) words += convertHundreds(lakh) + " Lakh ";
    if (thousand > 0) words += convertHundreds(thousand) + " Thousand ";
    if (hundred > 0) words += convertHundreds(hundred) + " ";

    words = words.trim() + " Rupees";
  }

  if (paise > 0) {
    words += (rupees > 0 ? " and " : "") + convertHundreds(paise) + " Paise";
  }

  return words.trim() + " Only";
}

export function formatIndianNumber(num) {
  if (!num) return "";
  const n = num.toString().split(".");
  let intPart = n[0];
  let lastThree = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  if (rest !== "") {
    lastThree = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  }
  return n.length > 1 ? lastThree + "." + n[1] : lastThree;
}
