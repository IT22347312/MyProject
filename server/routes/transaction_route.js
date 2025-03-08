const express = require("express");
const usersController = require("../controllers/usersController");
const isAuthenticated = require("../middleware/authMiddleware");
const categoryController = require("../controllers/categoryController");
const transactionController = require("../controllers/transactionController");
const transactionRouter = express.Router();

//!add
transactionRouter.post("/transactions/create",isAuthenticated,transactionController.create);
//! lists
transactionRouter.get("transactions/lists",isAuthenticated,transactionController.getFilteredTransactions);
//! update
transactionRouter.put("/transactions/update/:id",isAuthenticated,transactionController.update
);
//! delete
transactionRouter.delete("/transactions/delete/:id",isAuthenticated,transactionController.delete
);

module.exports = transactionRouter;
