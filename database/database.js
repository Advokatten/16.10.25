const mysql = require("mysql2/promise");

async function createConnection() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "gpz600xKrokeide",
    database: "users_db",
  });
}

module.exports = {
  createConnection,
};
