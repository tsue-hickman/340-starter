const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT classification_id, classification_name[1] AS classification_name FROM public.classification ORDER BY classification_name[1]"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error: " + error);
    throw error; // Rethrow the error to be handled by the controller
  }
}

/* ***************************
 *  Get vehicle by inventory_id
 * ************************** */
async function getInventoryByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inventory_id]
    );
    return data.rows[0]; // Return the first (and only) row
  } catch (error) {
    console.error("getInventoryByInventoryId error: " + error);
    throw error; // Rethrow the error to be handled by the controller
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryByInventoryId };