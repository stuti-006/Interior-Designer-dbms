const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Database
mongoose.connect("mongodb://127.0.0.1:27017/TrackoDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/sms", require("./routes/smsRoutes"));
app.use("/api/budget", require("./routes/budgetRoutes"));
app.use("/api/analysis", require("./routes/analysisRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));

// Server
app.listen(5000, () => console.log("Server running on port 5000"));
