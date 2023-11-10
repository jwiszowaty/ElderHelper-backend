const status = require("../db/data/test-data/status.js");
const {
  fetchJobs,
  createJob,
  fetchSingleJob,
  updateJob,
  insertNewUser,
  updateUser,
  fetchExistingUser,
  fetchAcceptedHelperJobs,
  jobToDelete,
  updateJobStatus,
  fetchJobsByElder,
  fetchJobsByPostCode,
  fetchAllUsers,
} = require("../models/app.models.js");

const fs = require("fs/promises");

exports.getEndpointsInfo = (req, res, next) => {
  fs.readFile(`${__dirname}/../endpoints.json`)
    .then((result) => {
      res.status(200).send({ endpoints: JSON.parse(result) });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getJobs = (req, res, next) => {
  const { postcode } = req.query;
  if (postcode) {
    fetchJobsByPostCode(postcode)
      .then((jobsByPostcode) => {
        res.status(200).send(jobsByPostcode);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    fetchJobs()
      .then((jobs) => {
        res.status(200).send(jobs);
      })
      .catch((err) => {
        next(err);
      });
  }
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

exports.deleteJob = (req, res, next) => {
  const { job_id } = req.params;
  fetchSingleJob(job_id)
    .then(() => {
      jobToDelete(job_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getJobsByElder = (req, res, next) => {
  const { elder_id } = req.params;
  fetchJobsByElder(elder_id)
    .then((jobs) => {
      res.status(200).send(jobs);
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
      res.status(200).send({ updatedUser: updatedUser });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getExistingUser = (req, res, next) => {
  const { phone_number } = req.params;
  fetchExistingUser(phone_number)
    .then((existingUser) => {
      res.status(200).send({ user: existingUser });
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

exports.changeJobStatus = (req, res, next) => {
  const { job_id } = req.params;
  const { status_id } = req.body;

  updateJobStatus(job_id, status_id)
    .then((completedJob) => {
      res.status(200).send({ completedJob: completedJob });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getChatMessages = (req, res, next) => {
  fetchChatMessages()
    .then((response) => {
      console.log("IN CONTROLLERS \n", response);
      res.statis(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};
