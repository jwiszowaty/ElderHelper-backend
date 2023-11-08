const express = require("express");
const app = express();

const {
  getEndpointsInfo,
  getJobs,
  postJob,
  getSingleJob,
  patchJob,
  postNewUser,
  patchUser,
  getAcceptedHelperJobs,
  deleteJob,
  changeJobStatus,
  getExistingUser,
  getJobsByElder

} = require("./controllers/app.controllers.js");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers.js");

app.use(express.json());

app.get('/api', getEndpointsInfo);

app.get("/api/jobs", getJobs);

app.get("/api/jobs/:job_id", getSingleJob);

app.get("/api/users/:user_id/:status", getAcceptedHelperJobs);

app.post("/api/jobs", postJob);

app.patch("/api/jobs/:job_id", patchJob);

app.patch("/api/:job_id", changeJobStatus);

app.delete("/api/jobs/:job_id", deleteJob);

//user endpoints

app.get('/api/jobs/elder/:elder_id', getJobsByElder)

app.post("/api/users", postNewUser);

app.patch("/api/users/:user_id", patchUser);

app.get("/api/users/:phone_number", getExistingUser);

//error handling

app.use(handlePSQLErrors, handleCustomErrors, handleServerErrors);

app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
});

module.exports = app;
