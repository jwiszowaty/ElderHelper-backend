const db = require("../db/connection.js");

exports.insertNewUser = (newUser) => {
  const newUserArr = Object.values(newUser);

  return db
    .query(
      `INSERT INTO users 
    (phone_number, 
    first_name, 
    surname, 
    is_elder, 
    postcode,
    avatar_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;`,
      newUserArr
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateUser = (edit, userId) => {
  const editArr = Object.values(edit);
  editArr.push(userId);

  console.log(editArr);
  return db
    .query(
      `UPDATE users
         SET phone_number = $1, first_name = $2, surname= $3, is_elder = $4, postcode = $5, avatar_url = $6
         WHERE user_id = $7
         RETURNING*;`,
      editArr
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
