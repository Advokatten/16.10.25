// Importerer pakker.
const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");

const app = express();

// Definerer hvilken port som skal være åpen for å motta forespørsler (req) fra klient.
const port = 4000;

// importerer funkjson som lager kobling til databasen.
const { createConnection } = require("./database/database");
const { insertIntoDatabase } = require("./database/app");
// importerer funkjson som henter data fra databasen.
const { getName } = require("./database/services");
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
  const results = await getName(connection);
  // definerer hvordan vi skal svare på forsepørslen (req) fra klienten på denne ruten.
  res.render("index", {
    user: results,
    title: "Title",
    message: "Kattefakta for dagen",
  });
});

app.get("/input", (req, res) => {
  return res.render("post");
});

app.post("/input", async (req, res) => {
  const connection = await createConnection();
  const input = req.body;

  await insertIntoDatabase(
    connection,
    input.name,
    input.lastName,
    input.postNumber
  );
  return res.send(`du la til ${name} ${lastName} ${postNumber}`);
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
