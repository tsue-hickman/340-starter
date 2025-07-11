const invModel = require("../models/inventory-model");
const Util = require("../utilities/");

const baseController = {};

baseController.buildHome = async function(req, res, next) {
  try {
    const nav = await Util.getNav();
    res.render("index", { title: "Home", nav });
  } catch (error) {
    next(error);
  }
};

module.exports = baseController;