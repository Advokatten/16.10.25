
async function getName(connection) {
      const [results] = await connection.query("SELECT * FROM user");
      return results;
}

module.exports = {getName}