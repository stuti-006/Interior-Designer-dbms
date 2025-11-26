const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// Add new expense
router.post("/add", async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.json({ success: true, expense });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Get all expenses
router.get("/", async (req, res) => {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
});

// Delete expense
router.delete("/:id", async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = router;
