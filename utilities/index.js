const invModel = require("../models/inventory-model")
const Util = {}

Util.getNav = async function (req, res, next) {
  try {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    if (data && data.length > 0) {
      data.forEach((row) => {
        list += "<li>"
        list += '<a href="/inv/type/' + row.classification_id + '" title="See our inventory of ' + row.classification_name + ' vehicles">' + row.classification_name + "</a>"
        list += "</li>"
      })
    } else {
      list += '<li><a href="#" title="No classifications available">No Categories</a></li>'
    }
    list += "</ul>"
    return list
  } catch (error) {
    console.error("getNav error: " + error)
    return '<ul><li><a href="/" title="Home page">Home</a></li></ul>' // Fallback
  }
}

Util.buildClassificationGrid = async function (data) {
  let grid = ""
  if (data && data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details"><img src="' + vehicle.inv_thumbnail + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildVehicleGrid = async function (data) {
  let grid = ""
  if (data) {
    grid += '<div id="vehicle-detail">'
    grid += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" />'
    grid += '<div class="vehicle-info">'
    grid += '<p><strong>Make:</strong> ' + data.inv_make + '</p>'
    grid += '<p><strong>Model:</strong> ' + data.inv_model + '</p>'
    grid += '<p><strong>Year:</strong> ' + data.inv_year + '</p>'
    grid += '<p><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
    grid += '<p><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
    grid += '<p><strong>Color:</strong> ' + data.inv_color + '</p>'
    grid += '<p><strong>Classification:</strong> ' + data.classification_name + '</p>'
    grid += '<p><strong>Description:</strong> ' + data.inv_description + '</p>'
    grid += '</div>'
    grid += '</div>'
  } else {
    grid += '<p class="notice">Sorry, vehicle not found.</p>'
  }
  return grid
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util