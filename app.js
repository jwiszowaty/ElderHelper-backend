const express = require("express");
const app = express();
const { postNewUser } = require("./controllers/app.controllers");
const { handleSQLErrors } = require("./controllers/error-handling");

app.use(express.json());

app.post("/api/users", postNewUser);

app.use(handleSQLErrors);
app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
});

module.exports = app;
