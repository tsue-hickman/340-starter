const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

async function buildHome(req, res, next) {
  let nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
}

async function buildByClassification(req, res, next) {
  const classification_id = req.params.classification_id;
  let nav = await utilities.getNav();
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let className = data.length > 0 ? data[0].classification_name : "Unknown";
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
    errors: null
  });
}

async function buildByInvId(req, res, next) {
  const inv_id = req.params.inv_id;
  let nav = await utilities.getNav();
  const data = await invModel.getInventoryById(inv_id);
  const detail = await utilities.buildDetailView(data);
  let itemName = `${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/detail", {
    title: itemName + " Detail",
    nav,
    detail,
    inv_id,
    errors: null
  });
}

async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    errors: null
  });
}

async function buildAddClassification(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  });
}

async function buildAddInventory(req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationSelect,
    errors: null
  });
}

async function addClassification(req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const classResult = await invModel.addClassification(classification_name);
  const classificationSelect = await utilities.buildClassificationList();

  if (classResult) {
    req.flash("notice", `Classification ${classification_name} added successfully!`);
    res.redirect("/inv/management");
  } else {
    req.flash("notice", "Sorry, adding the classification failed.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name
    });
  }
}

async function addInventory(req, res, next) {
  let nav = await utilities.getNav();
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  const invResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);

  if (invResult) {
    req.flash("notice", `Vehicle ${inv_make} ${inv_model} added successfully!`);
    res.redirect("/inv/management");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    req.flash("notice", "Sorry, adding the vehicle failed.");
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
}

async function buildEditInventory(req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
}

async function updateInventory(req, res, next) {
  let nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  const updateResult = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);

  if (updateResult) {
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/management");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
}

async function buildDeleteInventory(req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  });
}

async function deleteInventory(req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventory(inv_id);

  if (deleteResult) {
    req.flash("notice", "The vehicle was successfully deleted.");
    res.redirect("/inv/management");
  } else {
    const itemData = await invModel.getInventoryById(inv_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    req.flash("notice", "Sorry, the deletion failed.");
    res.status(501).render("./inventory/delete-inventory", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price
    });
  }
}

module.exports = invCont;