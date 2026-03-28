const mongoose = require("mongoose");

const chequeRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bank: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    chequeNo: {
      type: String,
      required: true,
      trim: true,
    },
    payee: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    acPayee: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: ["single", "bulk"],
      default: "single",
    },
    printCount: {
      type: Number,
      default: 1,
    },
    firstPrintedAt: {
      type: Date,
      default: Date.now,
    },
    lastPrintedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

chequeRecordSchema.index({ user: 1, bank: 1, chequeNo: 1 }, { unique: true });

module.exports = mongoose.model("ChequeRecord", chequeRecordSchema);
