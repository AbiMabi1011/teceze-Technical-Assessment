require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Employee = require("./models/Employee");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection (Explicitly targeting 'employee-management' database)
mongoose
  .connect(process.env.MONGO_URI, { dbName: "employee-management" })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server Running on Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed");
    console.error(err);
    process.exit(1);
  });

// Health Check
app.get("/", (req, res) => {
  res.send("Employee API Running");
});

// DB Status
app.get("/db-status", (req, res) => {
  res.json({
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// GET ALL EMPLOYEES
app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// CREATE EMPLOYEE
app.post("/employees", async (req, res) => {
  try {
    const employee = await Employee.create({
      employeeNo: req.body.employeeNo,
      employeeName: req.body.employeeName,
      designation: req.body.designation,
      salary: req.body.salary
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// UPDATE EMPLOYEE
app.put("/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        employeeName: req.body.employeeName,
        designation: req.body.designation,
        salary: req.body.salary
      },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found"
      });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// DELETE EMPLOYEE
app.delete("/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(
      req.params.id
    );

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found"
      });
    }

    res.json({
      message: "Employee Deleted"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});