const invModel = require("../models/inventory-model");

const Util = {};

Util.getNav = async function() {
  try {
    const data = await invModel.getClassifications();
    return data.rows;
  } catch (error) {
    console.error("getNav error: " + error);
    throw error;
  }
};

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;