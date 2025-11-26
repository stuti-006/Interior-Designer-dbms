const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    category: String,
    merchant: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Expense", ExpenseSchema);
