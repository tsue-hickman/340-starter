const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

app.set("view engine", "ejs")
app.set("views", "./views")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

app.use(express.static("public"))
app.use(static)
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)

app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404) { message = err.message } else { message = 'Oh no! There was a crash. Maybe try a different route?' }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

const port = process.env.PORT || 5500
const host = "0.0.0.0"
app.listen(port, host, () => {
  console.log(`trial app listening on ${host}:${port}`)
})