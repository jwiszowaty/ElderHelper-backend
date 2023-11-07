exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.constraint === "jobs_job_id_fkey") {
        res.status(404).send({message: "job not found"})
    }
    else if (err.code === "23503") {
        res.status(404).send({message: "23503 not found"})
    }
    else if (err.code === "23502") {
        res.status(400).send({message: "passed information insufficient"})
    }
    else if (err.code === "22P02") {
        res.status(400).send({message: "bad request"})
    }
    else if (err.code === "08P01") {
        res.status(400).send({message: "bad request"})
    } else {
        next(err)
    }
}
exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.message){
    res.status(err.status).send({message: err.message})
    } else {
        next(err)
    }
}
exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send('server error');
}