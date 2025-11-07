// Henter pakker.
const express = require("express");
const mysql = require("mysql2/promise");
//Bruker express
const app = express();

//Skaper koblingen til databasen
const { createConnection } = require("./database/database");
const { getName } = require("./database/services");

//tar i bruk ejs og express
app.set("view engine", "ejs");
//
app.use(express.static("public"));

//Async funksjon som viser hvor bruker skal få data?
app.get("/", async (req, res) => {
  const connection = await createConnection();
  const results = await getName(connection);
  res.render("index", {
    user: results,
    title: "Title",
    message: "Kattefakta for dagen",
  });
});

app.get("/fakta", async (req, res) => {
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

const port = 4000;

app.listen(port, (req, res) => {
  console.log(`"Denne serveren kjører på"${port}`);
});
