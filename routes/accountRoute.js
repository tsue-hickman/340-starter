const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountCont = require("../controllers/accountController");
const validate = require("../utilities/account-validation");

router.get("/login", utilities.handleErrors(accountCont.buildLogin));
router.post("/login", validate.accountRules(), validate.checkAccountData, utilities.handleErrors(accountCont.accountLogin));
router.get("/register", utilities.handleErrors(accountCont.buildRegister));
router.post("/register", validate.accountRules(), validate.checkAccountData, utilities.handleErrors(accountCont.registerAccount));
router.get("/", utilities.checkLogin, utilities.handleErrors(accountCont.buildAccountManagement));
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountCont.buildUpdateAccount));
router.post("/update", utilities.checkLogin, validate.accountRules(), validate.checkAccountData, utilities.handleErrors(accountCont.updateAccount));
router.post("/update-password", utilities.checkLogin, validate.passwordRules(), validate.checkPasswordData, utilities.handleErrors(accountCont.updatePassword));
router.get("/logout", utilities.checkLogin, accountCont.logout);

module.exports = router;