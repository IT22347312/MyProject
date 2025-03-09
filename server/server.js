require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require('./routes/budgetRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const goalRoutes = require('./routes/goalRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');



const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/goal', goalRoutes);
app.use('/api/dashboard', dashboardRoutes);



// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);  // Exit process if DB connection fails
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
