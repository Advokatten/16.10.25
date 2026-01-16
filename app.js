// importerer pakker.
const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 12;
const app = express();

// Definerer hvilken port som skal være åpen for å motta forespørsler (req) fra klient.
const port = 3000;
// importerer funkjson som lager kobling til databasen.
const { createConnection } = require("./database/database");
const {
  getUserData,
  insertIntoUserDatabase,
  insertIntoQuestionsDatabase,
  insertIntoUtviklerDatabase,
  handleSigninPost,
  handleSigninGet,
} = require("./database/services");

// konfigurerer EJS som malmotor.
app.set("view engine", "ejs");

// serverer statiske filer.
app.use(express.static("public"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

// Definerer hva som skal skje når vi får inn en forespørsel (req) med GET motode i http header
app.get("/", async (req, res) => {
  // åpner en ny mysql tilkobling
  const connection = await createConnection();
  // henter data fra databasen.
  const results = await getUserData(connection);
  // definerer hvordan vi skal svare på forsepørslen (req) fra klienten på denne ruten.
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

app.post("/signin", async (req, res) => {
  const connection = await createConnection();
  await handleSigninPost(req, res, connection, bcrypt);
});

app.get("/signin", async (req, res) => {
  await handleSigninGet(req, res);
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
