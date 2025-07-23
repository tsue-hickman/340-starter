const utilities = require("./");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");

const validate = {};

validate.accountRules = () => {
  return [
    body("account_firstname").trim().notEmpty().withMessage("First name required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name required."),
    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("Email required.")
      .isEmail()
      .withMessage("Valid email required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists && emailExists.account_id !== parseInt(account_id)) {
          throw new Error("Email already in use.");
        }
      })
  ];
};

validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password required.")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password must be 12+ chars with 1 uppercase, 1 lowercase, 1 number, 1 symbol.")
  ];
};

validate.checkAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    req.flash('error', errors.array().map(err => err.msg));
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
      account_id
    });
  }
  next();
};

validate.checkPasswordData = async (req, res, next) => {
  const { account_password, account_id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let accountData = await accountModel.getAccountById(account_id);
    req.flash('error', errors.array().map(err => err.msg));
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id
    });
  }
  next();
};

module.exports = validate;