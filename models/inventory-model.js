const pool = require("../database/");

  const invModel = {};

  invModel.getClassifications = async function() {
    try {
      const data = await pool.query("SELECT * FROM classification ORDER BY classification_name");
      return data;
    } catch (error) {
      console.error("getClassifications error: " + error);
      throw error;
    }
  };

  invModel.getVehicleById = async function(inv_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM inventory WHERE inv_id = $1`,
        [inv_id]
      );
      return data.rows[0];
    } catch (error) {
      console.error("getVehicleById error: " + error);
      throw error;
    }
  };

  invModel.addClassification = async function(classification_name) {
    try {
      const data = await pool.query(
        `INSERT INTO classification (classification_name) VALUES ($1) RETURNING *`,
        [classification_name]
      );
      return data.rows[0];
    } catch (error) {
      console.error("addClassification error: " + error);
      throw error;
    }
  };

  invModel.addVehicle = async function(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
    try {
      const data = await pool.query(
        `INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color]
      );
      return data.rows[0];
    } catch (error) {
      console.error("addVehicle error: " + error);
      throw error;
    }
  };

  invModel.searchVehicles = async function(searchTerm) {
    try {
      const data = await pool.query(
        `SELECT * FROM inventory WHERE inv_make ILIKE $1 OR inv_model ILIKE $1`,
        [`%${searchTerm}%`]
      );
      return data.rows;
    } catch (error) {
      console.error("searchVehicles error: " + error);
      throw error;
    }
  };

  module.exports = invModel;