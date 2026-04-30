async function insertIntoQuestionsDatabase(connection, question_text, userId) {
  const query = "INSERT INTO questions (question_text, user_id) VALUES (?, ?)";
  return await connection.execute(query, [question_text, userId]);
}

async function userRequestIntoDatabase(connection, requests, userId) {
  const query =
    "INSERT INTO user_requests (request_text, user_id) VALUES (?, ?)";
  return await connection.execute(query, [requests, userId]);
}

async function getUserData(connection, email) {
  const [results] = await connection.query(
    `SELECT * FROM advokat_user WHERE email = "${email}"`,
  );
  return results;
}

async function insertIntoUtviklerDatabase(connection, email, password) {
  const query = "INSERT INTO advokat_user (email, password) VALUES (?, ?)";
  return await connection.execute(query, [email, password]);
}

async function signIn(req, res, connection, bcrypt) {
  const userData = req.body;
  const dbUserInfo = await getUserData(connection, userData.email);

  if (dbUserInfo.length > 0 && dbUserInfo[0].email === userData.email) {
    const passwordMatch = await bcrypt.compare(
      userData.password,
      dbUserInfo[0].password,
    );
    if (passwordMatch) {
      console.log("Login successful!");
      req.session.userId = dbUserInfo[0].id;
      req.session.email = dbUserInfo[0].email;
      req.session.isAuthenticated = true;
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

async function signInGet(req, res) {
  res.render("signin", {
    title: "Log inn",
    heading: "Log inn",
  });
}

async function getAllMessages(connection) {
  const query = "SELECT * FROM questions ORDER BY id DESC";
  const [results] = await connection.execute(query);
  return results;
}

async function getUserMessages(connection, userId) {
  const query = "SELECT * FROM questions WHERE user_id = ? ORDER BY id DESC";
  const [results] = await connection.execute(query, [userId]);
  return results;
}

async function getUserRequests(connection, userId) {
  const query =
    "SELECT * FROM user_requests WHERE user_id = ? ORDER BY id DESC";
  const [results] = await connection.execute(query, [userId]);
  return results;
}

module.exports = {
  getUserData,
  insertIntoQuestionsDatabase,
  insertIntoUtviklerDatabase,
  signIn,
  signInGet,
  getAllMessages,
  getUserMessages,
  getUserRequests,
};
