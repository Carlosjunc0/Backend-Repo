/* *************************************************************
 * Account Route Module
 * This module defines the routes related to user account management.
 *************************************************************** */
// Needed Resources
const express = require("express")
const router = new express.Router()
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Route to display login view (GET)
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to display registration view (GET)
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to handle registration form submission (POST)
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Route to handle login form submission (POST)
// router.post("/login", utilities.handleErrors(accountController.loginAccount))

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkRegData,
  (req, res) => {
    res.status(200).send("login process")
  }
)

module.exports = router 

