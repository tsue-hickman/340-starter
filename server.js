const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/");
const session = require('express-session');
const flash = require('connect-flash');
const { body, validationResult } = require('express-validator');

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(static);
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Make flash messages available in views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use(utilities.handleErrors((req, res) => {
  res.status(404).render('errors/error', { title: '404 - Not Found', message: 'Sorry, page not found.' });
}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/error', { title: 'Server Error', message: 'Something went wrong!' });
});

app.use("/account", require("./routes/accountRoute"));

const port = process.env.PORT || 5500;
const host = "0.0.0.0";
app.listen(port, host, () => {
  console.log(`trial app listening on ${host}:${port}`);
});