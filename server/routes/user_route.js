const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Register API Endpoint
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, mobile_number, email, city, password, profile_pic,role = "user" } = req.body;

        if (!first_name || !last_name || !mobile_number || !email || !city || !password) {
            return res.status(400).json({ status: "required_failed", message: "Please send required details." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: "already_email", message: "This email is already taken." });
        }

        // Check if the password is already hashed (if it looks like a bcrypt hash)
        const isHashed = password.startsWith('$2b$');  // bcrypt hash starts with $2b$
        const hashedPassword = isHashed ? password : await bcrypt.hash(password, 10);  // If it's already hashed, use it as is. Otherwise, hash it.

        const newUser = new User({
            first_name,
            last_name,
            mobile_number,
            email,
            city,
            password: hashedPassword,  // Save the hashed password
            profile_pic,
            role
        });

        await newUser.save();
        res.status(201).json({ status: "success", message: "User registered successfully." });

    } catch (error) {
        res.status(500).json({ status: "failed", message: "Something went wrong.", error: error.message });
    }
});



// ✅ Login API Endpoint
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the input fields
        if (!email || !password) {
            return res.status(400).json({ status: "failed", message: "Email and password are required." });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: "invalid_user", message: "Incorrect email or password." });
        }

        // Debugging line: Check user details
        console.log("User found:", user);

        // Compare password with the stored hash
        const trimmedPassword = password.trim();
        const isMatch = await bcrypt.compare(trimmedPassword, user.password);
       

        // Debugging line: Log password comparison result
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ status: "invalid_user", message: "Incorrect email or password." });
        }

        // ✅ Fix: Ensure JWT_SECRET is defined
        const JWT_SECRET = process.env.JWT_SECRET;  // Ensure you use the environment variable for the secret
        if (!JWT_SECRET) {
            return res.status(500).json({ status: "error", message: "JWT secret is missing." });
        }

        // Generate JWT token (including user ID and any other required details)
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        // Respond with success and the generated token
        res.status(200).json({ status: "success", message: "Login successful", token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Something went wrong.", error: error.message });
    }
});

// ✅ Fetch all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ status: "success", users });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Something went wrong.", error: error.message });
    }
});

// ✅ Admin route to get all users (renamed for clarity)
router.get("/admin/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ status: "success", message: "All users retrieved successfully", data: users });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error retrieving users", error: error.message });
    }
});

module.exports = router;
