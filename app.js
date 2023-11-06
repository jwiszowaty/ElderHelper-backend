const express = require('express');
const app = express();
const { getJobs, postJob, getSingleJob, patchJob } = require ('./controllers/app.controllers.js')
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } = require("./controllers/errors.controllers.js")
app.use(express.json())

app.get('/api/jobs', getJobs);

app.get('/api/jobs/:job_id', getSingleJob);

app.post('/api/jobs', postJob);

app.patch('/api/jobs/:job_id', patchJob);

app.use(handlePSQLErrors, handleCustomErrors, handleServerErrors)

module.exports = app;