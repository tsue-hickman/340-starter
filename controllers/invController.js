const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { body, validationResult } = require('express-validator');

const invCont = {};

invCont.buildHome = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
};

invCont.buildByClassification = async function (req, res, next) {
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
};

invCont.buildByInvId = async function (req, res, next) {
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
};

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav
  });
};

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: ''
  });
};

invCont.addClassification = [
  body('classification_name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Classification name is required.')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('No spaces or special characters allowed.'),

  async (req, res, next) => {
    const { classification_name } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      req.flash('error', errors.array().map(err => err.msg));
      return res.render('inventory/add-classification', {
        title: 'Add Classification',
        nav,
        errors: errors.array(),
        classification_name
      });
    }

    const addResult = await invModel.addClassification(classification_name);
    if (addResult) {
      req.flash('success', 'Classification added successfully!');
      await utilities.getNav(); // Rebuild nav
      res.redirect('/inv/');
    } else {
      req.flash('error', 'Failed to add classification.');
      res.redirect('/inv/add-classification');
    }
  }
];

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render('inventory/add-inventory', {
    title: 'Add Inventory',
    nav,
    classificationList,
    errors: null,
    inv_make: '', inv_model: '', inv_year: '', inv_description: '', inv_image: '/images/vehicles/no-image.jpg',
    inv_thumbnail: '/images/vehicles/no-image-tn.jpg', inv_price: '', inv_miles: '', inv_color: '', classification_id: ''
  });
};

invCont.addInventory = [
  body('inv_make').trim().escape().notEmpty().withMessage('Make required.'),
  body('inv_model').trim().escape().notEmpty().withMessage('Model required.'),
  body('inv_year').trim().escape().isLength({ min: 4, max: 4 }).withMessage('Year must be 4 digits.').isNumeric().withMessage('Year must be numeric.'),
  body('inv_description').trim().escape().notEmpty().withMessage('Description required.'),
  body('inv_image').trim().escape().notEmpty().withMessage('Image path required.'),
  body('inv_thumbnail').trim().escape().notEmpty().withMessage('Thumbnail path required.'),
  body('inv_price').trim().escape().isNumeric().withMessage('Price must be numeric.'),
  body('inv_miles').trim().escape().isInt().withMessage('Miles must be integer.'),
  body('inv_color').trim().escape().notEmpty().withMessage('Color required.'),
  body('classification_id').trim().escape().isInt().withMessage('Valid classification required.'),

  async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      let classificationList = await utilities.buildClassificationList(classification_id);
      req.flash('error', errors.array().map(err => err.msg));
      return res.render('inventory/add-inventory', {
        title: 'Add Inventory',
        nav,
        classificationList,
        errors: errors.array(),
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
      });
    }

    const addResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);
    if (addResult) {
      req.flash('success', 'Inventory item added successfully!');
      res.redirect('/inv/');
    } else {
      req.flash('error', 'Failed to add inventory item.');
      res.redirect('/inv/add-inventory');
    }
  }
];

invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationList = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
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
};

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  const updateResult = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);

  if (updateResult) {
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`;
    req.flash('success', `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash('error', "Sorry, the update failed.");
    res.status(501).render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
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
};

invCont.buildDeleteInventory = async function (req, res, next) {
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
};

invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventory(inv_id);

  if (deleteResult) {
    req.flash("success", "The vehicle was successfully deleted.");
    res.redirect("/inv/");
  } else {
    const itemData = await invModel.getInventoryById(inv_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    req.flash("error", "Sorry, the deletion failed.");
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
};

module.exports = invCont;

// ... (keep existing functions)

invCont.buildEditInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationList = await utilities.buildClassificationList(itemData.classification_id);
  res.render("inventory/edit-inventory", {
    title: `Edit ${itemData.inv_make} ${itemData.inv_model}`,
    nav,
    classificationList,
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
    classification_id: itemData.classification_id,
    errors: null,
  });
};

invCont.updateInventory = [
  body('inv_make').trim().escape().notEmpty().withMessage('Required.'),
  body('inv_model').trim().escape().notEmpty().withMessage('Required.'),
  body('inv_year').trim().escape().isLength({ min: 4, max: 4 }).withMessage('4 digits.'),
  body('inv_description').trim().escape().notEmpty().withMessage('Required.'),
  body('inv_image').trim().escape().notEmpty().withMessage('Required.'),
  body('inv_thumbnail').trim().escape().notEmpty().withMessage('Required.'),
  body('inv_price').trim().escape().isNumeric().withMessage('Numeric.'),
  body('inv_miles').trim().escape().isInt().withMessage('Integer.'),
  body('inv_color').trim().escape().notEmpty().withMessage('Required.'),
  body('classification_id').trim().escape().isInt().withMessage('Valid ID.'),
  async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      let classificationList = await utilities.buildClassificationList(classification_id);
      req.flash('error', errors.array().map(err => err.msg));
      return res.render('inventory/edit-inventory', {
        title: `Edit ${inv_make} ${inv_model}`,
        nav,
        classificationList,
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
        classification_id,
        errors: errors.array(),
      });
    }
    const result = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);
    if (result) {
      req.flash('success', 'Inventory updated!');
      res.redirect('/inv/');
    } else {
      req.flash('error', 'Update failed.');
      res.redirect(`/inv/edit/${inv_id}`);
    }
  }
];

invCont.buildDeleteInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  res.render("inventory/delete-inventory", {
    title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
    nav,
    inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    errors: null,
  });
};

invCont.deleteInventory = async (req, res, next) => {
  const inv_id = parseInt(req.body.inv_id);
  const result = await invModel.deleteInventory(inv_id);
  if (result) {
    req.flash('success', 'Inventory deleted!');
    res.redirect('/inv/');
  } else {
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);
    req.flash('error', 'Deletion failed.');
    res.render("inventory/delete-inventory", {
      title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
      nav,
      inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
      errors: null,
    });
  }
};

invCont.buildSearch = async (req, res, next) => {
  let nav = await utilities.getNav();
  let searchResults = [];
  if (req.query.search_term) {
    searchResults = await invModel.searchInventory(req.query.search_term);
  }
  res.render("inventory/search", { title: "Search Results", nav, searchResults });
};

invCont.buildAddReview = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  res.render("inventory/add-review", { title: "Add Review", nav, inv_id, errors: null });
};

invCont.addReview = [
  body('review_text').trim().escape().notEmpty().withMessage('Required.'),
  body('review_rating').trim().escape().isInt({ min: 1, max: 5 }).withMessage('1-5 rating.'),
  async (req, res, next) => {
    const { inv_id, review_text, review_rating } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      req.flash('error', errors.array().map(err => err.msg));
      return res.render('inventory/add-review', { title: "Add Review", nav, inv_id, errors: errors.array(), review_text, review_rating });
    }
    const result = await invModel.addReview(inv_id, req.session.account.account_id, review_text, review_rating);
    if (result) {
      req.flash('success', 'Review added!');
      res.redirect(`/inv/detail/${inv_id}`);
    } else {
      req.flash('error', 'Review failed.');
      res.redirect(`/inv/add-review/${inv_id}`);
    }
  }
];

module.exports = invCont;