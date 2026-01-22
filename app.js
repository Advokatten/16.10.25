const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const app = express();

const port = 3000;
const { createConnection } = require("./database/database");
const {
  getUserData,

  insertIntoQuestionsDatabase,
  insertIntoUtviklerDatabase,
  signIn,
  signInGet,
} = require("./database/services");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Velkommen",
    heading: "Velkommen",
  });
});

app.get("/registerUser", async (req, res) => {
  res.render("registerUser", {
    title: "Registrer",
    heading: "Registrer deg",
  });
});

app.post("/registerUser", async (req, res) => {
  const connection = await createConnection();
  const input = req.body;
  const hashedPassword = await bcrypt.hash(input.password, saltRounds);
  await insertIntoUtviklerDatabase(connection, input.email, hashedPassword);
  res.redirect("/registerUser");
});

app.post("/dashboard", async (req, res) => {
  const connection = await createConnection();
  const input = req.body;
  await insertIntoQuestionsDatabase(connection, input.question_text);
  res.redirect("/dashboard");
});

app.post("/signIn", async (req, res) => {
  const connection = await createConnection();
  await signIn(req, res, connection, bcrypt);
});

app.get("/signIn", async (req, res) => {
  await signInGet(req, res);
});

app.get("/dashboard", async (req, res) => {
  res.render("dashboard", {
    title: "Spørsmål",
    heading: "Spørsmål",
  });
});

app.get("/about", async (req, res) => {
  res.render("about");
});

app.get("/fact", async (req, res) => {
  const catFact = await getCatFact();

  res.render("fact", {
    title: "Fakta",
    heading: "Velkommen til kattefakta",
    fact: catFact.fact,
  });
});

async function getCatFact() {
  const response = await fetch("https://catfact.ninja/fact");
  const data = await response.json();
  return data;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
