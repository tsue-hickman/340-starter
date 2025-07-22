const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { body, validationResult } = require('express-validator');

const invCont = {};

invCont.buildHome = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("index", { title: "Home", nav, errors: null });
};

invCont.buildByClassification = async function (req, res, next) {
  const classification_id = parseInt(req.params.classification_id);
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

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const data = await invModel.getInventoryById(inv_id);
  if (!data) {
    return next(new Error("Vehicle not found"));
  }
  const detail = await utilities.buildVehicleDetail(data);
  const reviews = await invModel.getReviewsByInventoryId(inv_id);
  let itemName = `${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/detail", {
    title: itemName + " Detail",
    nav,
    detail,
    reviews: reviews ? reviews.rows : [],
    inv_id,
    errors: null
  });
};

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null
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
    inv_make: '',
    inv_model: '',
    inv_year: '',
    inv_description: '',
    inv_image: '/images/vehicles/no-image.jpg',
    inv_thumbnail: '/images/vehicles/no-image-tn.jpg',
    inv_price: '',
    inv_miles: '',
    inv_color: '',
    classification_id: ''
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
  if (!itemData) {
    return next(new Error("Vehicle not found"));
  }
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

invCont.updateInventory = [
  body('inv_make').trim().escape().notEmpty().withMessage('Make required.'),
  body('inv_model').trim().escape().notEmpty().withMessage('Model required.'),
  body('inv_year').trim().escape().isLength({ min: 4, max: 4 }).withMessage('Year must be 4 digits.'),
  body('inv_description').trim().escape().notEmpty().withMessage('Description required.'),
  body('inv_image').trim().escape().notEmpty().withMessage('Image path required.'),
  body('inv_thumbnail').trim().escape().notEmpty().withMessage('Thumbnail path required.'),
  body('inv_price').trim().escape().isNumeric().withMessage('Price must be numeric.'),
  body('inv_miles').trim().escape().isInt().withMessage('Miles must be integer.'),
  body('inv_color').trim().escape().notEmpty().withMessage('Color required.'),
  body('classification_id').trim().escape().isInt().withMessage('Valid classification required.'),
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
        errors: errors.array()
      });
    }
    const result = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);
    if (result) {
      req.flash('success', 'Inventory updated!');
      res.redirect('/inv/');
    } else {
      let nav = await utilities.getNav();
      let classificationList = await utilities.buildClassificationList(classification_id);
      req.flash('error', 'Update failed.');
      res.render('inventory/edit-inventory', {
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
        errors: null
      });
    }
  }
];

invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  if (!itemData) {
    return next(new Error("Vehicle not found"));
  }
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

invCont.deleteInventory = [
  body('inv_id').trim().isInt().withMessage('Valid inventory ID required.'),
  async (req, res, next) => {
    const inv_id = parseInt(req.body.inv_id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      const itemData = await invModel.getInventoryById(inv_id);
      const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
      req.flash('error', errors.array().map(err => err.msg));
      return res.render("./inventory/delete-inventory", {
        title: "Delete " + itemName,
        nav,
        errors: errors.array(),
        inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price
      });
    }
    const deleteResult = await invModel.deleteInventory(inv_id);
    if (deleteResult) {
      req.flash("success", "The vehicle was successfully deleted.");
      res.redirect("/inv/");
    } else {
      let nav = await utilities.getNav();
      const itemData = await invModel.getInventoryById(inv_id);
      const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
      req.flash("error", "Sorry, the deletion failed.");
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
  }
];

invCont.buildSearch = async function (req, res, next) {
  let nav = await utilities.getNav();
  let searchResults = [];
  if (req.query.search_term) {
    const results = await invModel.searchInventory(req.query.search_term);
    searchResults = results ? results.rows : [];
  }
  res.render("inventory/search", {
    title: "Search Results",
    nav,
    searchResults,
    errors: null
  });
};

invCont.buildAddReview = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  if (!itemData) {
    return next(new Error("Vehicle not found"));
  }
  res.render("inventory/add-review", {
    title: "Add Review",
    nav,
    inv_id,
    errors: null
  });
};

invCont.addReview = [
  body('review_text').trim().escape().notEmpty().withMessage('Review text required.'),
  body('review_rating').trim().escape().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5.'),
  async (req, res, next) => {
    const { inv_id, review_text, review_rating } = req.body;
    const account_id = req.session.account ? req.session.account.account_id : null;
    if (!account_id) {
      req.flash('error', 'Please login to add a review.');
      return res.redirect('/account/login');
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      req.flash('error', errors.array().map(err => err.msg));
      return res.render('inventory/add-review', {
        title: "Add Review",
        nav,
        inv_id,
        errors: errors.array(),
        review_text,
        review_rating
      });
    }
    const result = await invModel.addReview(inv_id, account_id, review_text, parseInt(review_rating));
    if (result) {
      req.flash('success', 'Review added!');
      res.redirect(`/inv/detail/${inv_id}`);
    } else {
      req.flash('error', 'Review failed.');
      res.redirect(`/inv/add-review/${inv_id}`);
    }
  }
];

invCont.buildAdmin = async function (req, res, next) {
  let nav = await utilities.getNav();
  const accounts = await accountModel.getAllAccounts();
  res.render("inventory/admin", {
    title: "Admin Panel",
    nav,
    accounts: accounts ? accounts.rows : [],
    errors: null
  });
};

invCont.updateAccountType = [
  body('account_id').trim().isInt().withMessage('Valid account ID required.'),
  body('account_type').trim().isIn(['Client', 'Employee', 'Admin']).withMessage('Invalid account type.'),
  async (req, res, next) => {
    const { account_id, account_type } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      const accounts = await accountModel.getAllAccounts();
      req.flash('error', errors.array().map(err => err.msg));
      return res.render('inventory/admin', {
        title: "Admin Panel",
        nav,
        accounts: accounts ? accounts.rows : [],
        errors: errors.array()
      });
    }
    const result = await accountModel.updateAccountType(account_id, account_type);
    if (result) {
      req.flash('success', 'Account type updated!');
      res.redirect('/inv/admin');
    } else {
      req.flash('error', 'Update failed.');
      res.redirect('/inv/admin');
    }
  }
];

module.exports = invCont;