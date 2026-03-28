const nodemailer = require("nodemailer");

function createTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

async function sendOtpEmail({ to, otp, name }) {
  const transporter = createTransporter();
  const subject = "Cheque Printer password reset OTP";
  const text = `Hello ${name || "User"}, your OTP is ${otp}. It expires in 10 minutes.`;

  if (!transporter) {
    console.log(`OTP for ${to}: ${otp}`);
    return {
      delivered: false,
      fallback: true,
    };
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.GMAIL_USER,
    to,
    subject,
    text,
  });

  return {
    delivered: true,
    fallback: false,
  };
}

module.exports = {
  sendOtpEmail,
};
