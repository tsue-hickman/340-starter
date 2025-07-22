const pool = require("../database/");

async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

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
    console.error("getInventoryByClassificationId error: " + error);
    return null;
  }
}

async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryById error: " + error);
    return null;
  }
}

async function addClassification(classification_name) {
  try {
    const sql = 'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *';
    const data = await pool.query(sql, [classification_name]);
    return data.rows[0];
  } catch (error) {
    console.error("addClassification error: " + error);
    return null;
  }
}

async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = 'INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
    return data.rows[0];
  } catch (error) {
    console.error("addInventory error: " + error);
    return null;
  }
}

async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = `UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 
                 WHERE inv_id = $11 RETURNING *`;
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("updateInventory error: " + error);
    return null;
  }
}

async function deleteInventory(inv_id) {
  try {
    const sql = `DELETE FROM public.inventory WHERE inv_id = $1`;
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error("deleteInventory error: " + error);
    return null;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory
};

// ... (keep existing functions)

async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id]);
  } catch (error) {
    console.error("updateInventory error: " + error);
    return null;
  }
}

async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1";
    return await pool.query(sql, [inv_id]);
  } catch (error) {
    console.error("deleteInventory error: " + error);
    return null;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory
};

async function searchInventory(search_term) {
  try {
    const sql = "SELECT * FROM public.inventory WHERE inv_make ILIKE $1 OR inv_model ILIKE $1 OR inv_description ILIKE $1";
    return await pool.query(sql, [`%${search_term}%`]);
  } catch (error) {
    console.error("searchInventory error: " + error);
    return null;
  }
}

async function addReview(inv_id, account_id, review_text, review_rating) {
  try {
    const sql = "INSERT INTO reviews (inv_id, account_id, review_text, review_rating) VALUES ($1, $2, $3, $4) RETURNING *";
    return await pool.query(sql, [inv_id, account_id, review_text, review_rating]);
  } catch (error) {
    console.error("addReview error: " + error);
    return null;
  }
}
module.exports.addReview = addReview;

module.exports.searchInventory = searchInventory;