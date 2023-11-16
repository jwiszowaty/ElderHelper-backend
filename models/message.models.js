const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  user_id: {
    type: Number,
    unique: true,
  },
  messageBody: {
    type: String,
    required: true,
  },
});
