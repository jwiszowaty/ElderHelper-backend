const format = require("pg-format");
const db = require("../connection");

const seed = ({ userData, jobsData, statusData, messagesData }) => {
  return db
    .query(`DROP TABLE IF EXISTS messages;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS jobs;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS status;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })

    .then(() => {
      const statusTablePromise = db.query(`
        CREATE TABLE status (
          status_id Serial PRIMARY KEY,
          status VARCHAR NOT NULL
        );`);

      const usersTablePromise = db.query(`
        CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            phone_number VARCHAR NOT NULL,
            first_name VARCHAR NOT NULL,
            surname VARCHAR NOT NULL, 
            is_elder BOOLEAN NOT NULL,
            postcode VARCHAR NOT NULL,
            avatar_url VARCHAR DEFAULT 'https://images.unsplash.com/photo-1535320485706-44d43b919500',
            profile_msg VARCHAR DEFAULT 'hello'
        );`);
      return Promise.all([statusTablePromise, usersTablePromise]);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE jobs (
          job_id SERIAL PRIMARY KEY,
          job_title VARCHAR NOT NULL,
          job_desc VARCHAR NOT NULL,
          posted_date DATE DEFAULT NOW(),
          expiry_date DATE DEFAULT NOW(), 
          elder_id INT REFERENCES users(user_id),
          helper_id INT REFERENCES users(user_id),
          status_id INT REFERENCES status(status_id) DEFAULT 1,
          postcode VARCHAR NOT NULL
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE messages (
          message_id SERIAL PRIMARY KEY,
          elder_id INT,
          helper_id INT,
          status_id INT REFERENCES status(status_id),
          chat_room_id INT NOT NULL,
          message_body TEXT NOT NULL
        );`);
    })

    .then(() => {
      const insertMessagesQueryString = format(
        "INSERT INTO messages (elder_id, helper_id, status_id, chat_room_id, message_body) VALUES %L;",
        messagesData.map(
          ({ elder_id, helper_id, status_id, chat_room_id, message_body }) => [
            elder_id,
            helper_id,
            status_id,
            chat_room_id,
            message_body,
          ]
        )
      );

      return db.query(insertMessagesQueryString);
    })
    .then(() => {
      const insertStatusQueryString = format(
        "INSERT INTO status (status_id, status) VALUES %L;",
        statusData.map(({ status_id, status }) => [status_id, status])
      );

      const statusPromise = db.query(insertStatusQueryString);

      const insertUsersQueryString = format(
        "INSERT INTO users (phone_number, first_name, surname, is_elder, postcode, avatar_url, profile_msg) VALUES %L;",
        userData.map(
          ({
            phone_number,
            first_name,
            surname,
            is_elder,
            postcode,
            avatar_url,
            profile_msg,
          }) => [
            phone_number,
            first_name,
            surname,
            is_elder,
            postcode,
            avatar_url,
            profile_msg,
          ]
        )
      );
      const usersPromise = db.query(insertUsersQueryString);

      return Promise.all([statusPromise, usersPromise]);
    })
    .then(() => {
      const insertJobsQueryString = format(
        "INSERT INTO jobs (job_title, job_desc, posted_date, expiry_date, elder_id, helper_id, status_id, postcode) VALUES %L RETURNING *;",
        jobsData.map(
          ({
            job_title,
            job_desc,
            posted_date,
            expiry_date,
            elder_id,
            helper_id,
            status_id,
            postcode,
          }) => [
            job_title,
            job_desc,
            posted_date,
            expiry_date,
            elder_id,
            helper_id,
            status_id,
            postcode,
          ]
        )
      );

      return db.query(insertJobsQueryString);
    });
};

module.exports = seed;
