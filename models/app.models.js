const db = require("../db/connection.js");

exports.fetchJobs = () => {
  return db.query(`SELECT * FROM jobs`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchJobsByPostCode = (postcode) => {
  const postcodeQuery = `SELECT * FROM jobs
    WHERE postcode LIKE $1 || ' %' ESCAPE '\';`;
  return db.query(postcodeQuery, [postcode]).then(({ rows }) => {
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
      `INSERT INTO jobs (job_title, job_desc, posted_date, expiry_date, elder_id, helper_id, postcode) VALUES ($1, $2, $3, $4, $5, '1', $6) RETURNING *;`,
      [
        job.job_title,
        job.job_desc,
        job.posted_date,
        job.expiry_date,
        job.elder_id,
        job.postcode,
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateJob = (toUpdate, job_id) => {
  return db
    .query(
      `UPDATE jobs SET job_title = $1, job_desc = $2, expiry_date = $3, status_id = $4, helper_id = $5 WHERE job_id = $6 RETURNING *;`,
      [toUpdate.job_title, toUpdate.job_desc, toUpdate.expiry_date, toUpdate.status_id, toUpdate.helper_id, job_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.jobToDelete = (job_id) => {
  return db.query(
    `
  DELETE FROM jobs 
  WHERE job_id = $1;`,
    [job_id]
  );
};

exports.fetchJobsByElder = (elder_id) => {
  const findUserQuery = `
  SELECT * FROM users
  WHERE user_id = $1;`;

  return db.query(findUserQuery, [elder_id]).then(({ rows }) => {
    if (rows.length < 1) {
      return Promise.reject({
        status: 404,
        message: "User does not exist",
      });
    } else {
      return db
        .query(
          `
      SELECT * FROM jobs
      WHERE elder_id = $1;
      `,
          [elder_id]
        )
        .then(({ rows }) => {
          return rows;
        });
    }
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
         SET phone_number = $1, first_name = $2, surname= $3, is_elder = $4, postcode = $5, avatar_url = $6, profile_msg = $7
         WHERE user_id = $8
         RETURNING*;`,
      editArr
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "user_id does not exist",
        });
      }
      return rows[0];
    });
};

exports.fetchExistingUser = (phoneNumber) => {
  if (/^\d+$/.test(phoneNumber)) {
    return db
      .query(
        `SELECT phone_number, first_name, surname, is_elder, postcode, avatar_url, profile_msg FROM users WHERE phone_number = $1;`,
        [phoneNumber]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            message: "user does not exist",
          });
        }
        return rows[0];
      });
  } else {
    return Promise.reject({
      status: 400,
      message: "not a valid phone number",
    });
  }
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
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            message: "there is no user_id with jobs of this status",
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

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchChatMessages = (user_id, chatroom_id) => {
  // console.log(user_id, "<< user id\n", chatroom_id, "<<chatroom id");

  const isElderQuery = `
  SELECT first_name, is_elder FROM users
  WHERE user_id = $1;
  `;

  const fetchMessageQueryElder = `
  SELECT * FROM messages
  WHERE elder_id = $1 AND chat_room_id = $2
  ORDER BY message_id ASC;
  `;

  const fetchMessageQueryHelper = `
  SELECT * FROM messages
  WHERE helper_id = $1 AND chat_room_id = $2
  ORDER BY message_id ASC;
  `;

  return db
    .query(isElderQuery, [user_id])
    .then(({ rows }) => {
      return rows[0];
    })
    .then((result) => {
      if (result.is_elder === true) {
        return db
          .query(fetchMessageQueryElder, [user_id, chatroom_id])
          .then(({ rows }) => {
            return rows;
          });
      } else {
        return db
          .query(fetchMessageQueryHelper, [user_id, chatroom_id])
          .then(({ rows }) => {
            return rows;
          });
      }
    });
};
