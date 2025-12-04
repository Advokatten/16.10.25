// Importerer pakker.
const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");

const app = express();

// Definerer hvilken port som skal være åpen for å motta forespørsler (req) fra klient.
const port = 4000;

// importerer funkjson som lager kobling til databasen.
const { createConnection } = require("./database/database");
const { insertIntoDatabase } = require("./database/services");
// importerer funkjson som henter data fra databasen.
const { getCar } = require("./database/services");
// konfigurerer EJS som malmotor.
app.set("view engine", "ejs");
// serverer statiske filer.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// forteller hvor landingssiden er
app.get("/", async (req, res) => {
  // åpner en ny mysql tilkobling
  const connection = await createConnection();
  // henter data fra databasen.
  const results = await getCar(connection);
  // definerer hvordan vi skal svare på forsepørslen (req) fra klienten på denne ruten.
  res.render("index", {
    user: results,
    title: "Title",
    message: "Kattefakta for dagen",
  });
});

app.get("/register", (req, res) => {
  return res.render("register");
});

app.post("/register", async (req, res) => {
  const connection = await createConnection();
  const input = req.body;

  await insertIntoDatabase(
    connection,
    input.first_name,
    input.last_name,
    input.email,
    input.password,
  );
  return res.send(`du la til ${input.email} ${input.password}`);
});

app.get("/signin", (req, res) => {
  return res.render("signin");
});

app.post("signin", async (req, res) => {
  const connection = await createConnection();
  const userData = req.body;

  const dbUserInfo = await getUserData(connection, userData.email);
  console.log(dbUserInfo)[0].email;

  res.redirect("/signin");
});

// Forteller hvordan siden/koden skal svare til en get forespørsel?
app.get("/fakta", async (req, res) => {
  const catFact = await getCatFact();
  // definerer hvordan vi skal svare på forsepørslen (req) fra klienten på denne ruten.
  res.render("fact", {
    title: "Fakta",
    heading: "Velkommen til kattefakta",
    fact: catFact.fact,
  });
});

//En funksjon som henter data fra catfact
async function getCatFact() {
  const response = await fetch("https://catfact.ninja/fact");
  const data = await response.json();
  return data;
}

app.listen(port, (req, res) => {
  console.log(`"Denne serveren kjører på"${port}`);
});
