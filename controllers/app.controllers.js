const { insertNewUser } = require("../models/app.models");

exports.postNewUser = (req, res, next) => {
  const newUser = req.body;
  insertNewUser(newUser)
    .then((newUser) => {
      res.status(201).send({ newUser });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
