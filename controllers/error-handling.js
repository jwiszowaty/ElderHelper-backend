exports.handleSQLErrors = (err, req, res, next) => {
  if (err.code === "08P01") {
    res.status(400).send({ msg: "bad request" });
  }
};
