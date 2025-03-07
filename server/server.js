const express = require("express");
const cors = require("cors");
require('dotenv').config();
const mongoose = require("mongoose");
const userRoute = require("./routes/user_route");
const transactionRoutes = require("./routes/transaction_route");
const budgetRoutes = require("./routes/budget_route");
const reportRoutes = require("./routes/report_route");
const notificationRoutes = require("./routes/notification_route");
const goalRoutes = require("./routes/goal_route");
const currencyRoutes = require("./routes/currency_route");
const adminRoutes = require("./routes/admin_routes");

const app = express();

app.use(cors());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);  // Exit process if DB connection fails
});

// ✅ API Routes
app.use("/api", userRoute);
app.use("/api", transactionRoutes);
app.use("/api", budgetRoutes);
app.use("/api", reportRoutes);
app.use("/api", notificationRoutes);
app.use("/api", goalRoutes);
app.use("/api", currencyRoutes);
app.use("/api", adminRoutes);

// ✅ Global Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
});

// ✅ Start the Server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
