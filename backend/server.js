require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Employee = require("./models/Employee");

const app = express();

app.use(cors());
app.use(express.json());

const JSON_FILE_PATH = path.join(__dirname, "data.json");
let isUsingMongoDB = false;

// Initialize local fallback file if it doesn't exist
if (!fs.existsSync(JSON_FILE_PATH)) {
  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify([], null, 2));
}

// Connect to MongoDB Atlas (or fallback to local file)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    isUsingMongoDB = true;
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed. Falling back to local data.json storage.");
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
      const data = fs.readFileSync(JSON_FILE_PATH, "utf8");
      res.json(JSON.parse(data));
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
      const data = fs.readFileSync(JSON_FILE_PATH, "utf8");
      const employees = JSON.parse(data);

      // Unique check for Employee Number
      const exists = employees.some(emp => emp.employeeNo === req.body.employeeNo);
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

      employees.push(newEmp);
      fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(employees, null, 2));
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
      const data = fs.readFileSync(JSON_FILE_PATH, "utf8");
      let employees = JSON.parse(data);
      const index = employees.findIndex(emp => emp._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ error: "Employee not found." });
      }

      employees[index] = {
        ...employees[index],
        employeeName: req.body.employeeName,
        designation: req.body.designation,
        salary: Number(req.body.salary)
      };

      fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(employees, null, 2));
      res.json(employees[index]);
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
      const data = fs.readFileSync(JSON_FILE_PATH, "utf8");
      let employees = JSON.parse(data);
      const index = employees.findIndex(emp => emp._id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ error: "Employee not found." });
      }

      employees.splice(index, 1);
      fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(employees, null, 2));
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