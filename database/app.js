const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/input", (req, res) => {
  return res.render("post");
});

async function insertIntoDatabase(connection, name, lastName, postNumber) {
  const query = await connection.query(
    "INSERT into user (name, lastName, postNumber) VALUES(?, ?, ?)"
  );
  return await connection.execute(query, [name, lastName, postNumber]);
}

module.exports = {
  insertIntoDatabase,
};
