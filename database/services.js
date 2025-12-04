async function getCar(connection) {
  const [results] = await connection.query("SELECT * FROM user");

  return results;
}

async function insertIntoDatabase(
  connection,
  email,
  password,
  first_name,
  last_name,
) {
  const query =
    "INSERT INTO user (email, password, first_name, last_name) VALUES (?, ?, ?, ?)";
  return await connection.execute(query, [
    email,
    password,
    first_name,
    last_name,
  ]);
}
module.exports = { getCar, insertIntoDatabase };
