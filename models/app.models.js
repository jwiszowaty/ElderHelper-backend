const db = require('../db/connection.js')

exports.fetchJobs = () => {
    return db.query(`SELECT * FROM jobs`).then(({rows}) => {
        return rows
    })
}

exports.fetchSingleJob = (job_id) => {
    return db.query(`SELECT * FROM jobs WHERE job_id = $1`, [job_id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({
               status: 404,
               message: 'job not found'
            })
         }
        return rows
    })
}

exports.createJob = (job) => {
    return db.query(`INSERT INTO jobs (job_title, job_desc, posted_date, expiry_date, elder_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [job.job_title, job.job_desc, job.posted_date, job.expiry_date, job.elder_id]).then(({rows}) => {
        return rows[0]
    })
}

exports.updateJob = (toUpdate, job_id) => {
    // if (new Date() < new Date(toUpdate.expiry_date)) {
    //     console.log('in error')
    //     return Promise.reject({
    //         status: 400,
    //         message: 'bad request'
    //     })
    // }
    return db.query(`UPDATE jobs SET job_title = $1, job_desc = $2, expiry_date = $3 WHERE job_id = $4 RETURNING *;`, [toUpdate.job_title, toUpdate.job_desc, toUpdate.expiry_date, job_id])
    .then(({rows}) => {
        return rows[0]
    })
}
