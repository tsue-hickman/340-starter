const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const session = require('express-session');
const flash = require('connect-flash');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

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
app.use("/account", accountRoute);

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// JWT Configuration
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}.auth0.com/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}.auth0.com/`,
  algorithms: ['RS256']
}).unless({ path: ['/account/login', '/account/register', '/'] });

app.use(checkJwt);

app.use(utilities.handleErrors((req, res) => {
  res.status(404).render('errors/error', { title: '404 - Not Found', message: 'Sorry, page not found.' });
}));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).render('errors/error', { title: '401 - Unauthorized', message: 'Please login to access this page.' });
  } else {
    console.error(err.stack);
    res.status(500).render('errors/error', { title: 'Server Error', message: 'Something went wrong!' });
  }
});

const port = process.env.PORT || 5500;
const host = "0.0.0.0";
app.listen(port, host, () => {
  console.log(`trial app listening on ${host}:${port}`);
});