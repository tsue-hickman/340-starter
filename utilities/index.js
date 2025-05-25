const invModel = require("../models/inventory-model");
const Util = {};

Util.getNav = async function(req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function(data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => {
      grid += '<li>';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
      grid += '</h2>';
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetailHTML = async function(vehicle) {
  if (vehicle) {
    let detailHTML = '<div class="vehicle-detail">';
    
    // Vehicle image section
    detailHTML += '<div class="vehicle-image">';
    detailHTML += '<img src="' + vehicle.inv_image + '" alt="' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '">';
    detailHTML += '</div>';
    
    // Vehicle details section
    detailHTML += '<div class="vehicle-info">';
    detailHTML += '<h2>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>';
    
    // Price prominently displayed
    detailHTML += '<div class="price-section">';
    detailHTML += '<h3>Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</h3>';
    detailHTML += '</div>';
    
    // Vehicle specifications
    detailHTML += '<div class="vehicle-specs">';
    detailHTML += '<div class="spec-row"><span class="spec-label">Year:</span> <span class="spec-value">' + vehicle.inv_year + '</span></div>';
    detailHTML += '<div class="spec-row"><span class="spec-label">Make:</span> <span class="spec-value">' + vehicle.inv_make + '</span></div>';
    detailHTML += '<div class="spec-row"><span class="spec-label">Model:</span> <span class="spec-value">' + vehicle.inv_model + '</span></div>';
    detailHTML += '<div class="spec-row"><span class="spec-label">Mileage:</span> <span class="spec-value">' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</span></div>';
    detailHTML += '<div class="spec-row"><span class="spec-label">Color:</span> <span class="spec-value">' + vehicle.inv_color + '</span></div>';
    detailHTML += '</div>';
    
    // Description
    if (vehicle.inv_description) {
      detailHTML += '<div class="vehicle-description">';
      detailHTML += '<h4>Description:</h4>';
      detailHTML += '<p>' + vehicle.inv_description + '</p>';
      detailHTML += '</div>';
    }
    
    detailHTML += '</div>'; // Close vehicle-info
    detailHTML += '</div>'; // Close vehicle-detail
    
    return detailHTML;
  } else {
    return '<p class="notice">Sorry, no vehicle details could be found.</p>';
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;