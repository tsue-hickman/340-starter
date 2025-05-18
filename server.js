/* ******************************************
 * This is the application server
 * ******************************************/
const express = require("express")
const app = express()

/* ******************************************
 * Set EJS as view engine and serve static files
 * ******************************************/
app.set("view engine", "ejs")
app.use(express.static("public"))

/* ******************************************
 * Default GET route
 * ******************************************/
app.get("/", (req, res) => {
  res.render("index")
})

/* ******************************************
 * Server host name and port
 * ******************************************/
const HOST = 'localhost'
const PORT = 5500

/* ***********************
 * Log statement to confirm server operation
 * ***********************/
app.listen(PORT, () => {
  console.log(`trial app listening on ${HOST}:${PORT}`)
})