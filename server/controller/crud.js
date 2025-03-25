const db = require('../config/db');

// Create - Yeni bir kayıt ekleme
const createRecord = async (tableName, data) => {
  const placeholders = Object.keys(data).map(() => '?').join(',');
  const query = `INSERT INTO ${tableName} (${Object.keys(data).join(',')}) VALUES (${placeholders})`;

  const [result] = await db.execute(query, Object.values(data));
  return result;
};

// Read - Belirli bir kayıt okuma
const readRecord = async (tableName, username) => {
  const query = `SELECT * FROM ${tableName} WHERE username = ?`;
  const [rows] = await db.execute(query, [username]);
  return rows[0];
};

// Read - Belirli bir kayıt okuma
const readRecordForGoogle = async (tableName, mail) => {
  const query = `SELECT * FROM ${tableName} WHERE mail = ?`;
  const [rows] = await db.execute(query, [mail]);
  return rows[0];
};


// Read All - Tüm kayıtları okuma
const readAllRecords = async (tableName) => {
  const query = `SELECT * FROM ${tableName}`;
  const [rows] = await db.execute(query);
  return rows;
};

// Update - Bir kaydı güncelleme
const updateRecord = async (tableName, username, password) => {
  const query = `UPDATE ${tableName} SET password = "${password}" WHERE username = "${username}"`;
  const [result] = await db.execute(query, [username]);
  return result;
};

const updateRecordForReset = async (tableName, mail, resetToken, resetTokenExpiration) => {
  const query = `UPDATE ${tableName} SET resetToken = "${resetToken}", resetTokenExpiration = "${resetTokenExpiration}" WHERE mail = "${mail}"`;
  const [result] = await db.execute(query);
  return result;
};

// Delete - Bir kaydı silme
const deleteRecord = async (tableName, userid) => {
  const query = `DELETE FROM ${tableName} WHERE userid = ?`;
  const [result] = await db.execute(query, [userid]);
  return result;
};

const checkmails = async (tableName, mail) => {
  const query = `SELECT * FROM ${tableName} WHERE mail = ?`;
  console.log('Executing query:', query, 'with mail:', mail);
  const [rows] = await db.execute(query, [mail]);
  console.log('Query result:', rows);
  return rows.length > 0 ? rows[0] : null;
};


module.exports = {
  createRecord,
  readRecord,
  readAllRecords,
  updateRecord,
  deleteRecord,
  checkmails,
  updateRecordForReset,
  readRecordForGoogle
};
