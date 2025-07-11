const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const staticRoute = require("./routes/static");
const utilities = require("./utilities/");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

app.use(staticRoute);
app.use("/inv", inventoryRoute);

app.get("/", utilities.handleErrors(baseController.buildHome));

const HOST = '0.0.0.0'; // Listen on all interfaces
const PORT = process.env.PORT || 5500; // Use Render's PORT or fallback to 5500

app.listen(PORT, HOST, () => {
  console.log(`trial app listening on ${HOST}:${PORT}`);
});