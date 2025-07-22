const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const accountCont = {};

accountCont.buildLogin = async (req, res) => {
  let nav = await utilities.getNav();
  res.render("account/login", { title: "Login", nav, errors: null });
};

accountCont.buildRegister = async (req, res) => {
  let nav = await utilities.getNav();
  res.render("account/register", { title: "Register", nav, errors: null });
};

accountCont.registerAccount = [
  body("account_firstname").trim().escape().notEmpty().withMessage("First name required."),
  body("account_lastname").trim().escape().notEmpty().withMessage("Last name required."),
  body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Email required.")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email);
      if (emailExists) throw new Error("Email exists.");
    }),
  body("account_password").trim().notEmpty().withMessage("Password required.").isStrongPassword({
    minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
  }).withMessage("12+ chars, 1 each: upper, lower, number, symbol."),

  async (req, res) => {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      req.flash('error', errors.array().map(err => err.msg));
      return res.render("account/register", { title: "Register", nav, errors: errors.array(), account_firstname, account_lastname, account_email });
    }
    const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, account_password);
    if (regResult) {
      req.flash('success', `Registered ${account_firstname}. Login now.`);
      res.redirect("/account/login");
    } else {
      req.flash('error', "Registration failed.");
      res.redirect("/account/register");
    }
  }
];

accountCont.accountLogin = [
  body("account_email").trim().escape().notEmpty().withMessage("Email required.").isEmail().withMessage("Valid email required."),
  body("account_password").trim().notEmpty().withMessage("Password required."),

  async (req, res) => {
    const { account_email, account_password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      req.flash('error', errors.array().map(err => err.msg));
      return res.render("account/login", { title: "Login", nav, errors: errors.array(), account_email });
    }
    const account = await accountModel.getAccountByEmail(account_email);
    if (!account || !(await bcrypt.compare(account_password, account.account_password))) {
      req.flash('error', "Invalid credentials.");
      res.redirect("/account/login");
      return;
    }
    const token = jwt.sign({ account_id: account.account_id, account_type: account.account_type }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true });
    delete account.account_password;
    req.session.account = account;
    req.flash('success', "Logged in.");
    res.redirect("/account/");
  }
];

accountCont.buildAccountManagement = async (req, res) => {
  let nav = await utilities.getNav();
  res.render("account/account-management", { title: "Account Management", nav, errors: null });
};

accountCont.buildUpdateAccount = async (req, res) => {
  const account_id = parseInt(req.params.account_id);
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountByEmail(req.session.account.account_email);
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  });
};

accountCont.updateAccount = [
  body("account_firstname").trim().escape().notEmpty().withMessage("First name required."),
  body("account_lastname").trim().escape().notEmpty().withMessage("Last name required."),
  body("account_email").trim().escape().notEmpty().withMessage("Email required.").isEmail().withMessage("Valid email required."),

  async (req, res) => {
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
        account_id,
      });
    }
    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);
    if (updateResult) {
      req.session.account = updateResult.rows[0];
      req.flash('success', "Account updated.");
      res.redirect("/account/");
    } else {
      req.flash('error', "Update failed.");
      res.redirect("/account/update");
    }
  }
];

accountCont.logout = (req, res) => {
  res.clearCookie('jwt');
  req.session.destroy(err => {
    if (err) res.redirect("/account/");
    res.redirect("/");
  });
};

module.exports = accountCont;