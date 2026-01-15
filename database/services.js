async function getUserData(connection, email) {
  const [results] = await connection.query(
    `SELECT * FROM user WHERE email = "${email}"`,
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

module.exports = {
  getUserData,
  insertIntoUserDatabase,
  insertIntoQuestionsDatabase,
  insertIntoUtviklerDatabase,
};
