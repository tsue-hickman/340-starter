const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getInventoryByInventoryId(inventory_id);
  
  if (data) {
    const vehicleHTML = await utilities.buildVehicleDetailHTML(data);
    let nav = await utilities.getNav();
    const vehicleTitle = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
    
    res.render('./inventory/detail', {
      title: vehicleTitle,
      nav,
      vehicleHTML,
    });
  } else {
    const error = new Error('Vehicle not found');
    error.status = 404;
    next(error);
  }
};

/* ***************************
 *  Build intentional error
 * ************************** */
invCont.buildIntentionalError = async function (req, res, next) {
  const error = new Error('This is an intentional 500 error for testing purposes');
  error.status = 500;
  next(error);
};

module.exports = invCont;