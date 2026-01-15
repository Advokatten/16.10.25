// importerer pakker.
const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");

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
  res.render("index", { cars: results });
});

app.get("/registerUser", (req, res) => {
  res.render("registerUser");
});

app.post("/registerUser", async (req, res) => {
  const connection = await createConnection();
  const input = req.body;
  await insertIntoUtviklerDatabase(connection, input.email, input.password);
  res.redirect("/registerUser");
});

app.post("/questions", async (req, res) => {
  const connection = await createConnection();
  const input = req.body;
  await insertIntoQuestionsDatabase(connection, input.question_text);
  res.redirect("/questions");
});

app.get("/questions", async (req, res) => {
  res.render("questions");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post("/signin", async (req, res) => {
  const connection = await createConnection();
  const userData = req.body;
  const dbUserInfo = await getUserData(connection, userData.email);
  console.log(dbUserInfo[0].email);
  console.log(dbUserInfo[0].password);

  if (
    !dbUserInfo[0].email === "hello@hello.no" &&
    !dbUserInfo[0].password === "Kappa123"
  ) {
    res.redirect("/signin");
  }

  if (
    !dbUserInfo[0].email === "Olanormann@gmail.com" &&
    !dbUserInfo[0].password === "Kappa123"
  ) {
    res.redirect("/signin");
  }
  // const connection = await createConnection();
  // const input = req.body;
  // await insertIntoUserDatabase(connection, input.first_name, input.last_name, input.email, input.password);
  res.redirect("/dashboard");
});
app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/about", (req, res) => {
  // definerer hvordan vi skal svare på forsepørslen (req) fra klienten på denne ruten.
  res.render("about");
});

// Definerer hva som skal skje når vi får inn en forespørsel (req) med GET motode i http header
app.get("/brukere", (req, res) => {
  // definerer hvordan vi skal svare på forsepørslen (req) fra klienten på denne ruten.
  // sender ned et objekt med informasjon som vi kan bruke i malen.
  res.render("users", { names: ["per", "Ole", "Olesya", "Ådne", "Christian"] });
});

app.get("/fact", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
