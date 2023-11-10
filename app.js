const express = require("express");
const app = express();

const {
  getEndpointsInfo,
  getJobs,
  postJob,
  getSingleJob,
  patchJob,
  postNewUser,
  patchUser,
  getAcceptedHelperJobs,
  deleteJob,
  changeJobStatus,
  getExistingUser,
  getJobsByElder,
  getAllUsers,
  getChatMessages,
  getJobsUsers,
} = require("./controllers/app.controllers.js");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/errors.controllers.js");

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const server = require("http").Server(app);
const io = socketio(server);

dotenv.config();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// const messagesRouter = require('./routes/messages');
// app.use('/messages', messagesRouter);

// Socket.IO
io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

app.use(express.json());

app.get("/api", getEndpointsInfo);

app.get("/api/jobs", getJobs);

app.get("/api/jobs/users", getJobsUsers);

app.get("/api/jobs/:job_id", getSingleJob);

app.get("/api/users/:user_id/:status", getAcceptedHelperJobs);

app.post("/api/jobs", postJob);

app.patch("/api/jobs/:job_id", patchJob);

app.patch("/api/:job_id", changeJobStatus);

app.delete("/api/jobs/:job_id", deleteJob);

//user endpoints

app.get("/api/jobs/elder/:elder_id", getJobsByElder);

app.post("/api/users", postNewUser);

app.patch("/api/users/:user_id", patchUser);

app.get("/api/users/:phone_number", getExistingUser);

//Chat endpoints

app.get("/api/users", getAllUsers);

app.get("/api/messages/:user_id", getChatMessages);

//error handling

app.use(handlePSQLErrors, handleCustomErrors, handleServerErrors);

app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
});

module.exports = { app, server };
