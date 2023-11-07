const {
  fetchJobs,
  createJob,
  fetchSingleJob,
  updateJob,
  insertNewUser,
  updateUser,
  fetchAcceptedHelperJobs,
} = require("../models/app.models.js");

exports.getJobs = (req, res, next) => {
  fetchJobs()
    .then((jobs) => {
      res.status(200).send(jobs);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getSingleJob = (req, res, next) => {
  const { job_id } = req.params;
  fetchSingleJob(job_id)
    .then((job) => {
      res.status(200).send({ job });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postJob = (req, res, next) => {
  const newJob = req.body;
  createJob(newJob)
    .then((job) => {
      res.status(201).send({ job });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchJob = (req, res, next) => {
  const { job_id } = req.params;
  const toUpdate = req.body;
  fetchSingleJob(job_id)
    .then(() => {
      updateJob(toUpdate, job_id).then((job) => {
        res.status(200).send({ job });
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewUser = (req, res, next) => {
  const newUser = req.body;
  insertNewUser(newUser)
    .then((newUser) => {
      res.status(201).send({ newUser });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchUser = (req, res, next) => {
  const { user_id } = req.params;
  const edit = req.body;

  updateUser(edit, user_id)
    .then((updatedUser) => {
      res.status(200).send({ updatedUser });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAcceptedHelperJobs = (req, res, next) => {
  const { user_id } = req.params;
  const { status } = req.params;

  fetchAcceptedHelperJobs(user_id, status)
    .then((acceptedJobs) => {
      res.status(200).send({ acceptedJobs: acceptedJobs });
    })
    .catch((err) => {
      next(err);
    });
};
