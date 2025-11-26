const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

// Function to calculate current month range
function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
}

// GET /api/alerts/check
router.get("/check", async (req, res) => {
  try {
    const budget = await Budget.findOne();
    if (!budget) return res.json({ message: "No budget set yet." });

    const { start, end } = getMonthRange();

    const expenses = await Expense.find({ date: { $gte: start, $lt: end } });

    let used = {
      food: 0,
      travel: 0,
      shopping: 0,
      bills: 0,
      others: 0
    };

    expenses.forEach(e => {
      used[e.category] += e.amount;
    });

    let alerts = [];

    // Compare each category vs. budget
    for (let category in budget.categories) {
      const spent = used[category];
      const limit = budget.categories[category];

      if (spent >= limit) {
        alerts.push(`🚨 You have exceeded your ${category} budget of Rs.${limit}. Spent: Rs.${spent}`);
      } else if (spent >= limit * 0.8) {
        alerts.push(`⚠️ You are close to your ${category} budget. Spent: Rs.${spent} / Rs.${limit}`);
      }
    }

    // If no alerts
    if (alerts.length === 0) {
      alerts.push("✅ All your expenses are within limits!");
    }

    res.json({ alerts, used, budget: budget.categories });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
