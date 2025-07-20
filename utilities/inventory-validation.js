const utilities = require("./");
const { body, validationResult } = require("express-validator");

const validate = {};

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isLength({ min: 1 })
      .withMessage("Classification name must be at least 1 character.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name must contain only letters and numbers.")
  ];
};

validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required.")
      .isLength({ min: 2 })
      .withMessage("Make must be at least 2 characters."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required.")
      .isLength({ min: 2 })
      .withMessage("Model must be at least 2 characters."),
    body("inv_year")
      .isInt({ min: 1886 })
      .withMessage("Year must be a valid number greater than or equal to 1886."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required.")
      .matches(/\.(jpg|jpeg|png|gif)$/)
      .withMessage("Image path must be a valid image file (jpg, jpeg, png, gif)."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required.")
      .matches(/\.(jpg|jpeg|png|gif)$/)
      .withMessage("Thumbnail path must be a valid image file (jpg, jpeg, png, gif)."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
    body("classification_id")
      .isInt({ min: 1 })
      .withMessage("Valid classification is required.")
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.status(400).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name
    });
  }
  next();
};

validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    return res.status(400).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: errors.array(),
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
  next();
};

validate.checkUpdateInventoryData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    return res.status(400).render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: errors.array(),
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
  next();
};

module.exports = validate;