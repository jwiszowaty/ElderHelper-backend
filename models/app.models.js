const db = require("../db/connection.js");
const Promise = require("fs/promises");

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

  return db
    .query(
      `UPDATE users
         SET phone_number = $1, first_name = $2, surname= $3, is_elder = $4, postcode = $5, avatar_url = $6
         WHERE user_id = $7
         RETURNING*;`,
      editArr
    )
    .then(({ rows }) => {
      // if (rows.length === 0) {
      //   console.log("here");
      //   return next({ status: 404, msg: "user_id does not exist" });
      // }
      return rows[0];
    });
};
