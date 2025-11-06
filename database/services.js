
async function getName(connection) {
      const [results] = await connection.query("SELECT * FROM user WHERE postNumber = 7500");
      return results;
}

module.exports = {getName}