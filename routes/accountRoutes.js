const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountCont = require("../controllers/accountController");

router.get("/login", utilities.handleErrors(accountCont.buildLogin));
router.post("/login", accountCont.accountLogin);
router.get("/register", utilities.handleErrors(accountCont.buildRegister));
router.post("/register", accountCont.registerAccount);
router.get("/", utilities.checkLogin, utilities.handleErrors(accountCont.buildAccountManagement));
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountCont.buildUpdateAccount));
router.post("/update", utilities.checkLogin, accountCont.updateAccount);
router.get("/logout", utilities.checkLogin, accountCont.logout);

module.exports = router;