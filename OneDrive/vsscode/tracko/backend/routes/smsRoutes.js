const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// Helper: auto categorize based on merchant + keywords
function autoCategorize(sms, merchant) {
  sms = sms.toLowerCase();
  merchant = merchant.toLowerCase();

  if (
    sms.includes("swiggy") ||
    sms.includes("zomato") ||
    sms.includes("food") ||
    merchant.includes("swiggy") ||
    merchant.includes("zomato")
  ) {
    return "food";
  }
  if (
    sms.includes("ola") ||
    sms.includes("uber") ||
    sms.includes("rapido") ||
    sms.includes("cab") ||
    merchant.includes("ola") ||
    merchant.includes("uber")
  ) {
    return "travel";
  }
  if (
    sms.includes("amazon") ||
    sms.includes("myntra") ||
    sms.includes("flipkart") ||
    merchant.includes("amazon") ||
    merchant.includes("flipkart")
  ) {
    return "shopping";
  }
  if (
    sms.includes("electricity") ||
    sms.includes("gas") ||
    sms.includes("bill") ||
    sms.includes("recharge")
  ) {
    return "bills";
  }

  return "others"; // default
}

// 🔹 1) Just PARSE SMS (no DB, same as before)
router.post("/parse", (req, res) => {
  const { sms } = req.body;

  // Amount extraction
  const amountRegex = /(?:Rs\.?|INR)\s?([\d,]+\.?\d*)/i;
  const amountMatch = sms.match(amountRegex);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : null;

  // Merchant extraction
  const merchantRegex = /(?:at|to)\s([A-Za-z0-9 &.-]+)/i;
  const merchantMatch = sms.match(merchantRegex);
  const merchant = merchantMatch ? merchantMatch[1].trim() : "Unknown";

  // Type (credit/debit)
  let type = "debit";
  if (sms.toLowerCase().includes("credited") || sms.toLowerCase().includes("received")) {
    type = "credit";
  }

  const title = type === "credit" ? "Amount Credited" : "Purchase";
  const category = autoCategorize(sms, merchant);

  res.json({
    success: true,
    data: {
      title,
      amount,
      category,
      merchant,
      type,
      date: new Date()
    }
  });
});

// 🔹 2) PARSE + SAVE INTO DATABASE
router.post("/auto-add", async (req, res) => {
  try {
    const { sms } = req.body;

    // Amount
    const amountRegex = /(?:Rs\.?|INR)\s?([\d,]+\.?\d*)/i;
    const amountMatch = sms.match(amountRegex);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : null;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Could not detect amount from SMS" });
    }

    // Merchant
    const merchantRegex = /(?:at|to)\s([A-Za-z0-9 &.-]+)/i;
    const merchantMatch = sms.match(merchantRegex);
    const merchant = merchantMatch ? merchantMatch[1].trim() : "Unknown";

    // Type
    let type = "debit";
    if (sms.toLowerCase().includes("credited") || sms.toLowerCase().includes("received")) {
      type = "credit";
    }

    const title = type === "credit" ? "Amount Credited" : "Purchase";
    const category = autoCategorize(sms, merchant);

    // 👉 Create Expense document and save to MongoDB
    const expense = new Expense({
      title,
      amount,
      category,
      merchant
      // date will auto-use default Date.now from model
    });

    await expense.save();

    res.json({
      success: true,
      message: "Expense created from SMS",
      expense
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
