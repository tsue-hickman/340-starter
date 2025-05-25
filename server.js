/* ******************************************
 * This is the application server
 * ******************************************/
const express = require("express");
const app = express();
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const staticRoute = require("./routes/static"); 
const utilities = require("./utilities/");
const invController = require("./controllers/invController");

/* ******************************************
 * Set EJS as view engine and serve static files
 * ******************************************/
app.set("view engine", "ejs");

// Static routes - MUST BE FIRST
app.use(staticRoute);

// Inventory routes
app.use("/inv", inventoryRoute);

/* ******************************************
 * Default GET route
 * ******************************************/
app.get("/", baseController.buildHome);

/* ******************************************
 * Server host name and port
 * ******************************************/
const HOST = 'localhost';
const PORT = 5500;

// Route for intentional error (add this route)
app.get('/trigger-error', utilities.handleErrors(invController.buildIntentionalError));

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ 
    message = err.message
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Log statement to confirm server operation
 * ***********************/
app.listen(PORT, () => {
  console.log(`trial app listening on ${HOST}:${PORT}`);
});