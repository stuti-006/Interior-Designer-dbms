const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");

// Helper: get first & last date of current month
function getMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { start, end };
}

// 1. Monthly Total Spend
router.get("/monthly-total", async (req, res) => {
    const { start, end } = getMonthRange();

    const expenses = await Expense.find({
        date: { $gte: start, $lt: end }
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({ total });
});

// 2. Category-wise monthly analysis
router.get("/categories", async (req, res) => {
    const { start, end } = getMonthRange();

    const expenses = await Expense.find({
        date: { $gte: start, $lt: end }
    });

    let categoryTotals = {};

    expenses.forEach(e => {
        if (!categoryTotals[e.category]) categoryTotals[e.category] = 0;
        categoryTotals[e.category] += e.amount;
    });

    res.json(categoryTotals);
});

// 3. Daily spending for graph
router.get("/daily", async (req, res) => {
    const { start, end } = getMonthRange();

    const expenses = await Expense.find({
        date: { $gte: start, $lt: end }
    });

    let daily = {};

    expenses.forEach(e => {
        const day = e.date.toISOString().split("T")[0];
        if (!daily[day]) daily[day] = 0;
        daily[day] += e.amount;
    });

    res.json(daily);
});

// 4. Highest spending category
router.get("/top-category", async (req, res) => {
    const { start, end } = getMonthRange();

    const expenses = await Expense.find({
        date: { $gte: start, $lt: end }
    });

    let map = {};

    expenses.forEach(e => {
        if (!map[e.category]) map[e.category] = 0;
        map[e.category] += e.amount;
    });

    let top = null;
    let max = 0;

    for (let cat in map) {
        if (map[cat] > max) {
            max = map[cat];
            top = cat;
        }
    }

    res.json({ topCategory: top, amount: max });
});

// 5. Monthly budget comparison
router.get("/budget-status", async (req, res) => {
    const { start, end } = getMonthRange();

    const budget = await Budget.findOne();
    const expenses = await Expense.find({
        date: { $gte: start, $lt: end }
    });

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
        used
    });
});

module.exports = router;
