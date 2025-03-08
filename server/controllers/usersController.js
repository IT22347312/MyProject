const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
const usersController = {
  // Register
  register: asyncHandler(async (req, res) => {
    const { first_name, last_name, mobile_number, email, password, profile_pic } = req.body;
    
    // Validate
    if (!first_name || !last_name || !mobile_number || !email || !password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: "User already exists" });
      return;
    }
    
    // Hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create and save the user
    const userCreated = await User.create({
      first_name,
      last_name,
      mobile_number,
      email,
      password: hashedPassword,
      profile_pic,
    });

    // Send the response without the password
    res.json({
      message: `🎉 Welcome, ${userCreated.first_name}! Your account has been successfully registered.`,
      first_name: userCreated.first_name,
      last_name: userCreated.last_name,
      mobile_number: userCreated.mobile_number,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),

  // Login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // Check if email is valid
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid login credentials" });
      return;
    }
    
    // Compare the user password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid login credentials" });
      return;
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });
    
    // Send the response
    res.json({
        message: `LOGIN SUCCESS...🎉 Welcome back, ${user.first_name}!!`,
      token,
      id: user._id,
      email: user.email,
      first_name: user.first_name,
    });
  }),

  // Profile
  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ first_name: user.first_name, email: user.email });
  }),

  // Update user profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, first_name } = req.body;
    
    // Check for email uniqueness
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== req.user.toString()) {
        res.status(400).json({ error: "Email already in use" });
        return;
      }
    }

    // Update the user's profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { first_name, email },
      { new: true }
    );

    res.json({ message: "User profile updated successfully", updatedUser });
  }),
};

module.exports = usersController;
