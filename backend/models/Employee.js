const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeNo: {
    type: String,
    required: true,
    unique: true
  },

  employeeName: {
    type: String,
    required: true
  },

  designation: {
    type: String,
    required: true
  },

  salary: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model(
  "Employee",
  employeeSchema
);