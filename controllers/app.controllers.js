const { fetchJobs, createJob, fetchSingleJob, updateJob } = require ('../models/app.models.js')

exports.getJobs = (req, res, next) => {
    fetchJobs().then((jobs) =>{
        res.status(200).send(jobs)
    })
    .catch((err) => {next(err)})
}

exports.getSingleJob = (req, res, next) => {
    const {job_id} = req.params;
    fetchSingleJob(job_id).then((job) => {
        res.status(200).send({job})
    })
    .catch((err) => {next(err)})
}

exports.postJob = (req, res, next) => {
    const newJob = req.body;
    createJob(newJob).then((job) => {
        res.status(201).send({job})
    })
    .catch((err) => {next(err)})
}

exports.patchJob = (req, res, next) => {
    const {job_id} = req.params;
    const toUpdate = req.body;
    fetchSingleJob(job_id).then(() => {
    updateJob(toUpdate, job_id).then((job) => {
        res.status(200).send({job})
    })
    })
    .catch((err) => {next(err)})
}
