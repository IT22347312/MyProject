const express = require("express");
const cors = require("cors");
require('dotenv').config();
const mongoose = require("mongoose");
const userRoute = require("./routes/user_route");

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

// ✅ Global Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
});

// ✅ Start the Server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
