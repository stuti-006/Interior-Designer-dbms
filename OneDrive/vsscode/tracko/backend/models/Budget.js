const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
    monthlyIncome: Number,
    categories: {
        food: Number,
        travel: Number,
        shopping: Number,
        bills: Number,
        others: Number
    }
});

module.exports = mongoose.model("Budget", BudgetSchema);
