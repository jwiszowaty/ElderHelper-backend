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
  const setValues = Object.values(edit);
  //setValues.push(Object.values(edit)[0]);
  setValues.push(userId);

  console.log(setValues);

  return db
    .query(
      `UPDATE users
         SET phone_number = $1
         WHERE user_id = $2
         RETURNING*;`,
      setValues
    )
    .then(({ rows }) => {
      console.log(rows);
      return rows[0];
    });
};
