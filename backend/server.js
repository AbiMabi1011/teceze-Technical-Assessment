require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Employee = require("./models/Employee");

const app = express();

app.use(cors());
app.use(express.json());

// In-memory fallback database to prevent read-only filesystem errors (EROFS) on hosting platforms like Vercel
let localEmployees = [];
let isUsingMongoDB = false;

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, { dbName: "employee-management" })
  .then(() => {
    console.log("MongoDB Connected Successfully");
    isUsingMongoDB = true;
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed. Falling back to in-memory local fallback.");
    console.log("Error details:", err.message);
  });

// --- API ROUTES ---

// 1. GET ALL EMPLOYEES
app.get("/employees", async (req, res) => {
  try {
    if (isUsingMongoDB) {
      const employees = await Employee.find();
      res.json(employees);
    } else {
      res.json(localEmployees);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// 2. CREATE EMPLOYEE
app.post("/employees", async (req, res) => {
  try {
    if (isUsingMongoDB) {
      const employee = new Employee(req.body);
      await employee.save();
      res.status(201).json(employee);
    } else {
      // Unique check for Employee Number
      const exists = localEmployees.some(emp => emp.employeeNo === req.body.employeeNo);
      if (exists) {
        return res.status(400).json({ code: 11000, message: "Employee Number must be unique." });
      }

      const newEmp = {
        _id: Date.now().toString(),
        employeeNo: req.body.employeeNo,
        employeeName: req.body.employeeName,
        designation: req.body.designation,
        salary: Number(req.body.salary)
      };

      localEmployees.push(newEmp);
      res.status(201).json(newEmp);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// 3. UPDATE EMPLOYEE
app.put("/employees/:id", async (req, res) => {
  try {
    if (isUsingMongoDB) {
      const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(employee);
    } else {
      const index = localEmployees.findIndex(emp => emp._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ error: "Employee not found." });
      }

      localEmployees[index] = {
        ...localEmployees[index],
        employeeName: req.body.employeeName,
        designation: req.body.designation,
        salary: Number(req.body.salary)
      };

      res.json(localEmployees[index]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// 4. DELETE EMPLOYEE
app.delete("/employees/:id", async (req, res) => {
  try {
    if (isUsingMongoDB) {
      await Employee.findByIdAndDelete(req.params.id);
      res.json({ message: "Employee Deleted" });
    } else {
      const index = localEmployees.findIndex(emp => emp._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ error: "Employee not found." });
      }

      localEmployees.splice(index, 1);
      res.json({ message: "Employee Deleted" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});