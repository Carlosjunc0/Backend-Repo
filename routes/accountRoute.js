/* *************************************************************
 * Account Route Module
 * This module defines the routes related to user account management.
 *************************************************************** */
// Needed Resources
const express = require("express");
const router = new express.Router();
const regValidate = require("../utilities/account-validation");
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const invController = require("../controllers/invController");

// Route to display login view (GET)
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to display registration view (GET)
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister),
);

// Account Management View
router.get(
  "/manage",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to display account update view (GET)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to update account information 
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
)

// Route to log out the user
router.get("/logout", 
  utilities.handleErrors(accountController.logout)
)

// Route to update account information
router.post(
  "/update",
  utilities.checkJWTToken,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Route to update account password
router.post(
  "/update-password",
  utilities.checkJWTToken,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Route to handle registration form submission (POST)
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount),
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
);

module.exports = router;
