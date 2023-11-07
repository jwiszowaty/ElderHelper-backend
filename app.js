const express = require("express");
const app = express();
const {
  getJobs,
  postJob,
  getSingleJob,
  patchJob,
  postNewUser,
  patchUser,
  getExistingUser,
} = require("./controllers/app.controllers.js");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers.js");

app.use(express.json());

app.get("/api/jobs", getJobs);

app.get("/api/jobs/:job_id", getSingleJob);

app.post("/api/jobs", postJob);

app.patch("/api/jobs/:job_id", patchJob);

app.get("/api/users/:phone_number", getExistingUser);

app.post("/api/users", postNewUser);

app.patch("/api/users/:user_id", patchUser);

app.use(handlePSQLErrors, handleCustomErrors, handleServerErrors);

app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
});

module.exports = app;
