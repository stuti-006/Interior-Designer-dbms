const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

// Set budget
router.post("/set", async (req, res) => {
    await Budget.deleteMany({});
    const budget = new Budget(req.body);
    await budget.save();

    res.json({ success: true, budget });
});

// Get full budget
router.get("/summary", async (req, res) => {
    const budget = await Budget.findOne();
    res.json(budget);
});

// Check category usage vs budget
router.get("/check", async (req, res) => {
    const budget = await Budget.findOne();
    const expenses = await Expense.find();

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

    res.json({
        budget: budget.categories,
        used: used
    });
});

module.exports = router;
