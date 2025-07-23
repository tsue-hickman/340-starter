const pool = require("../database");
const bcrypt = require("bcryptjs");

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ($1, $2, $3, $4) RETURNING *";
    return await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword]);
  } catch (error) {
    console.error("registerAccount error: " + error);
    return null;
  }
}

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rows[0];
  } catch (error) {
    console.error("checkExistingEmail error: " + error);
    return null;
  }
}

async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getAccountByEmail error: " + error);
    return null;
  }
}

async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getAccountById error: " + error);
    return null;
  }
}

async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("updateAccount error: " + error);
    return null;
  }
}

async function updatePassword(account_id, account_password) {
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [hashedPassword, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("updatePassword error: " + error);
    return null;
  }
}

async function getAllAccounts() {
  try {
    return await pool.query("SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account");
  } catch (error) {
    console.error("getAllAccounts error: " + error);
    return null;
  }
}

async function updateAccountType(account_id, account_type) {
  try {
    const sql = "UPDATE account SET account_type = $1 WHERE account_id = $2 RETURNING *";
    return await pool.query(sql, [account_type, account_id]);
  } catch (error) {
    console.error("updateAccountType error: " + error);
    return null;
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
  getAllAccounts,
  updateAccountType
};