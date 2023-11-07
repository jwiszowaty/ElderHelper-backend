const db = require("../db/connection.js");

exports.fetchJobs = () => {
  return db.query(`SELECT * FROM jobs`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchSingleJob = (job_id) => {
  return db
    .query(`SELECT * FROM jobs WHERE job_id = $1`, [job_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "job not found",
        });
      }
      return rows;
    });
};

exports.createJob = (job) => {
  return db
    .query(
      `INSERT INTO jobs (job_title, job_desc, posted_date, expiry_date, elder_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [
        job.job_title,
        job.job_desc,
        job.posted_date,
        job.expiry_date,
        job.elder_id,
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateJob = (toUpdate, job_id) => {
  // if (new Date() < new Date(toUpdate.expiry_date)) {
  //     console.log('in error')
  //     return Promise.reject({
  //         status: 400,
  //         message: 'bad request'
  //     })
  // }
  return db
    .query(
      `UPDATE jobs SET job_title = $1, job_desc = $2, expiry_date = $3 WHERE job_id = $4 RETURNING *;`,
      [toUpdate.job_title, toUpdate.job_desc, toUpdate.expiry_date, job_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.insertNewUser = (newUser) => {
  const newUserArr = Object.values(newUser);

  return db
    .query(
      `INSERT INTO users 
    (phone_number, 
    first_name, 
    surname, 
    is_elder, 
    postcode,
    avatar_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;`,
      newUserArr
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateUser = (edit, userId) => {
  const editArr = Object.values(edit);
  editArr.push(userId);

  return db
    .query(
      `UPDATE users
         SET phone_number = $1, first_name = $2, surname= $3, is_elder = $4, postcode = $5, avatar_url = $6
         WHERE user_id = $7
         RETURNING*;`,
      editArr
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        console.log("here");
        return Promise.reject({
          status: 404,
          message: "user_id does not exist",
        });
      }
      return rows[0];
    });
};

exports.fetchAcceptedHelperJobs = (userId, status) => {
  const statusObj = {
    requested: 1,
    accepted: 2,
    completed: 3,
    expired: 4,
  };
  if (statusObj.hasOwnProperty(status)) {
    return db
      .query(
        `SELECT job_title, job_desc, posted_date, expiry_date, elder_id, helper_id, status_id 
      FROM jobs 
      WHERE helper_id = $1 AND 
      status_id = $2;`,
        [userId, statusObj[status]]
      )
      .then(({ rows }) => {
        console.log(rows);
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            message: "user_id does not exist",
          });
        }
        return rows;
      });
  } else {
    return Promise.reject({
      status: 404,
      message: "Path not found!",
    });
  }
};
