const format = require('pg-format');
const db = require('../connection'); 


//default elder url: https://images.unsplash.com/photo-1535320485706-44d43b919500
//default helper url: https://images.unsplash.com/photo-1590086783191-a0694c7d1e6e

//CHANGE TO REFLECT OUT DATA
const seed = ({ userData, jobData, statusData }) => { 
    return db
      .query(`DROP TABLE IF EXISTS users;`)
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS jobs;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS status;`);
      })

//       insert chat table data here later

      .then(() => {
        console.log("creating status table")
        const statusTablePromise = db.query(`
        CREATE TABLE status (
          status_id VARCHAR PRIMARY KEY,
          status_name VARCHAR NOT NULL
        );`);

        console.log("create users table")
        const usersTablePromise = db.query(`
        CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            phone_number VARCHAR(11) NOT NULL,
            first_name VARCHAR NOT NULL,
            surname VARCHAR NOT NULL, 
            is_elder BOOLEAN NOT NULL,
            postcode VARCHAR NOT NULL,
            avatar_url VARCHAR DEFAULT 'https://images.unsplash.com/photo-1535320485706-44d43b919500',
            profile_msg VARCHAR DEFAULT 'hello'
        );`)
        return Promise.all([statusTablePromise, usersTablePromise]);
      })
      .then(() => {
        console.log("creating jobs table")
        //expiry_date TIMESTAMP DEFAULT NOW() + INTERVAL 3 DAY, could be wrong
        return db.query(`
        CREATE TABLE jobs (
          job_id VARCHAR PRIMARY KEY,
          job_title VARCHAR NOT NULL,
          job_description VARCHAR NOT NULL,
          posted_date TIMESTAMP DEFAULT NOW(),
          expiry_date TIMESTAMP DEFAULT NOW() + INTERVAL 3 DAY, 
          elder_id INT NOT NULL,
          helper_id INT NOT NULL,
          status_id INT NOT NULL
        );`);
      })
    //   .then(() => {
    //     const insertTopicsQueryStr = format(
    //       'INSERT INTO topics (slug, description) VALUES %L;',
    //       topicData.map(({ slug, description }) => [slug, description])
    //     );
    //     const topicsPromise = db.query(insertTopicsQueryStr);
  
    //     const insertUsersQueryStr = format(
    //       'INSERT INTO users ( username, name, avatar_url) VALUES %L;',
    //       userData.map(({ username, name, avatar_url }) => [
    //         username,
    //         name,
    //         avatar_url,
    //       ])
    //     );
    //     const usersPromise = db.query(insertUsersQueryStr);
  
    //     return Promise.all([topicsPromise, usersPromise]);
    //   })
    //   .then(() => {
    //     const formattedArticleData = articleData.map(convertTimestampToDate);
    //     const insertArticlesQueryStr = format(
    //       'INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;',
    //       formattedArticleData.map(
    //         ({
    //           title,
    //           topic,
    //           author,
    //           body,
    //           created_at,
    //           votes = 0,
    //           article_img_url,
    //         }) => [title, topic, author, body, created_at, votes, article_img_url]
    //       )
    //     );
  
    //     return db.query(insertArticlesQueryStr);
    //   })
    //   .then(({ rows: articleRows }) => {
    //     const articleIdLookup = createRef(articleRows, 'title', 'article_id');
    //     const formattedCommentData = formatComments(commentData, articleIdLookup);
  
    //     const insertCommentsQueryStr = format(
    //       'INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;',
    //       formattedCommentData.map(
    //         ({ body, author, article_id, votes = 0, created_at }) => [
    //           body,
    //           author,
    //           article_id,
    //           votes,
    //           created_at,
    //         ]
    //       )
    //     );
    //     return db.query(insertCommentsQueryStr);
    //   });
  };

module.exports = seed;