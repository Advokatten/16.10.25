async function getUserData(connection, email) {
  const [results] = await connection.query(
    `SELECT * FROM advokat_user WHERE email = "${email}"`,
  );
  return results;
}

async function insertIntoUserDatabase(
  connection,
  first_name,
  last_name,
  email,
  password,
) {
  const query =
    "INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
  return await connection.execute(query, [
    first_name,
    last_name,
    email,
    password,
  ]);
}

async function insertIntoQuestionsDatabase(connection, question_text) {
  const query = "INSERT INTO questions (question_text) VALUES (?)";
  return await connection.execute(query, [question_text]);
}

async function insertIntoUtviklerDatabase(connection, email, password) {
  const query = "INSERT INTO advokat_user (email, password) VALUES (?, ?)";
  return await connection.execute(query, [email, password]);
}

async function handleSigninPost(req, res, connection, bcrypt) {
  const userData = req.body;
  const dbUserInfo = await getUserData(connection, userData.email);

  if (dbUserInfo.length > 0 && dbUserInfo[0].email === userData.email) {
    const passwordMatch = await bcrypt.compare(
      userData.password,
      dbUserInfo[0].password,
    );
    if (passwordMatch) {
      console.log("Login successful!");
      res.redirect("/dashboard");
    } else {
      console.log("Login failed!");
      res.redirect("/signin");
    }
  } else {
    console.log("Login failed!");
    res.redirect("/signin");
  }
}

async function handleSigninGet(req, res) {
  res.render("signin", {
    title: "Log inn",
    heading: "Log inn",
  });
}

module.exports = {
  getUserData,
  insertIntoUserDatabase,
  insertIntoQuestionsDatabase,
  insertIntoUtviklerDatabase,
  handleSigninPost,
  handleSigninGet,
};
