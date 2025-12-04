async function getName(connection) {
  const [results] = await connection.query("SELECT * FROM user");
  return results;
}

async function insertIntoDatabase(
  connection,
  first_name,
  last_name,
  email,
  password,
) {
  console.log(first_name, last_name, email, password);

  const query =
    "INSERT into user (first_name, last_name, email, password) VALUES ( ?, ?, ?, ? )";
  return await connection.execute(query, [
    first_name,
    last_name,
    email,
    password,
  ]);
}

module.exports = { getName, insertIntoDatabase };
