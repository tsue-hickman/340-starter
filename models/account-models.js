const pool = require("../database/");
const bcrypt = require("bcrypt");

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *";
    return await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword]);
  } catch (error) {
    return null;
  }
}

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query("SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1", [account_email]);
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function updatePassword(account_id, account_password) {
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    return await pool.query(sql, [hashedPassword, account_id]);
  } catch (error) {
    console.error(error);
    return null;
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, updateAccount, updatePassword };