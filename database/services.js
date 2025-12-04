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
module.exports = { getUserData, insertIntoUserDatabase };
