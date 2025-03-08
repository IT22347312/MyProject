const express = require("express");
const usersController = require("../controllers/usersController");
const isAuthenticated = require("../middleware/authMiddleware");
const userRouter = express.Router();

userRouter.post("/register", usersController.register);
userRouter.post("/login", usersController.login);
userRouter.get("/profile", isAuthenticated, usersController.profile);
userRouter.put("/update-profile", isAuthenticated, usersController.updateUserProfile);


module.exports = userRouter;
