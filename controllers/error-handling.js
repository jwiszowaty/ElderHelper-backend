exports.handleSQLErrors = (err, req, res, next) => {
  if (err.code === "08P01" || err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  }
};
