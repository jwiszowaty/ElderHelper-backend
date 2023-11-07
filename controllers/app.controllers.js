const { insertNewUser, updateUser } = require("../models/app.models");

exports.postNewUser = (req, res, next) => {
  const newUser = req.body;
  insertNewUser(newUser)
    .then((newUser) => {
      res.status(201).send({ newUser });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchUser = (req, res, next) => {
  const { user_id } = req.params;
  const edit = req.body;

  updateUser(edit, user_id)
    .then((updatedUser) => {
      res.status(200).send({ updatedUser });
    })
    .catch((err) => {
      next(err);
    });
};
