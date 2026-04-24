const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const saltRounds = 12;

const app = express();

const port = 3000;
const { createConnection } = require("./database/database");
const {
  insertIntoQuestionsDatabase,
  insertIntoUtviklerDatabase,
  signIn,
  signInGet,
  getAllMessages,
  userRequestIntoDatabase,
} = require("./database/services");

app.set("view engine", "ejs");
app.set("trust proxy", 1);
app.use(express.static("Public"));
app.use(bodyParser.urlencoded());
app.use(expressLayouts);

app.use(bodyParser.json());

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    maxAge: 300000,
  }),
);

const checkAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/signIn");
  }
};

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Velkommen",
    heading: "Velkommen til CatFacts Code",
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

app.get("/dashboard", checkAuth, async (req, res) => {
  const connection = await createConnection();
  const messages = await getAllMessages(connection);
  res.render("dashboard", {
    title: "Spørsmål",
    heading: "Forespørsler til Catfact Coding",
    email: req.session.email,
    messages: messages,
  });
});

app.post("/dashboard", checkAuth, async (req, res) => {
  const connection = await createConnection();
  const input = req.body;
  await insertIntoQuestionsDatabase(connection, input.question_text);
  res.redirect("/dashboard");
});

app.get("/requests", checkAuth, async (req, res) => {
  const connection = await createConnection();
  const messages = await getAllMessages(connection);
  res.render("requests", {
    title: "Forespørsmål",
    heading: "Hva vil du at vi skal gjøre?",
    email: req.session.email,
    messages: messages,
  });
});

app.post("/requests", checkAuth, async (req, res) => {
  const connection = await createConnection();
  const input = req.body;
  await userRequestIntoDatabase(connection, input.question_text);
  res.redirect("/requests");
});

app.post("/signIn", async (req, res) => {
  const connection = await createConnection();
  await signIn(req, res, connection, bcrypt);
});

app.get("/signIn", async (req, res) => {
  await signInGet(req, res);
});

app.get("/signOut", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error logging out");
    }
    res.redirect("/");
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

app.listen(port, () => {});
