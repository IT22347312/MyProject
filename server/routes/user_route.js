const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register API Endpoint
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, mobile_number, email, city, password, profile_pic } = req.body;

        if (!first_name || !last_name || !mobile_number || !email || !city || !password) {
            return res.status(400).json({ status: "required_failed", message: "Please send required details." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: "already_email", message: "This email is already taken." });
        }

        const hashedPassword = bcrypt.hashSync(password, 10); 
        User.password = hashedPassword;

        const newUser = new User({
            first_name,
            last_name,
            mobile_number,
            email,
            city,
            password: hashedPassword,
            profile_pic
        });

        await newUser.save();
        res.status(201).json({ status: "success", message: "User registered successfully." });

    } catch (error) {
        res.status(500).json({ status: "failed", message: "Something went wrong.", error: error.message });
    }
});

// Login API Endpoint
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: "invalid_user", message: "Incorrect email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: "invalid_user", message: "Incorrect email or password." });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ status: "success", message: "Login successful", token });

    } catch (error) {
        res.status(500).json({ status: "failed", message: "Something went wrong.", error: error.message });
    }
});

// Fetch all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ status: "success", users });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Something went wrong.", error: error.message });
    }
});

// Admin route to get all users
router.get("/admin/register", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ status: "success", message: "All users retrieved successfully", data: users });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error retrieving users", error: error.message });
    }
});

module.exports = router;
