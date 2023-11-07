const express = require("express");
const app = express();
const { getJobs, postJob, getSingleJob, patchJob, postNewUser, patchUser } = require ('./controllers/app.controllers.js')
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } = require("./controllers/errors.controllers.js")
const { handleSQLErrors } = require("./controllers/error-handling");

app.use(express.json())

app.get('/api/jobs', getJobs);

app.get('/api/jobs/:job_id', getSingleJob);

app.post('/api/jobs', postJob);

app.patch('/api/jobs/:job_id', patchJob);

app.post("/api/users", postNewUser);
app.patch("/api/users/:user_id", patchUser);

app.use(handleSQLErrors);
app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
});

app.use(handlePSQLErrors, handleCustomErrors, handleServerErrors)

module.exports = app;
