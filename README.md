# Employee Management System (CRUD)

This is a simple full-stack Employee Management System created for the technical assessment. It allows you to perform basic CRUD operations (Create, Read, Update, Delete) on employee records.

## Tech Stack Used

- **Frontend:** React, Axios, CSS
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas (Cloud)

---

## Project Structure

- `backend/` - Contains the Express server and the Mongoose schema.
- `frontend/` - Contains the React app and layout styling.

---

## Features

- **Employee List:** Displays all employees in a clean table showing their ID, Name, Designation, and Salary in LKR.
- **Add Employee:** A modal form opens to add new employees. The Employee No is automatically generated.
- **Edit Employee:** Allows you to update the Name, Designation, and Salary of any employee.
- **Delete Employee:** Deletes the employee record with a confirmation prompt.

---

## How to Setup and Run Locally

### 1. Database Configuration
Inside the `backend/` folder, create a `.env` file and add your MongoDB connection string:


### 2. Run the Backend
Go to the `backend` folder, install the packages, and start the server:
```bash
cd backend
npm install
npm run dev
```
The server will start running on `http://localhost:5000`.

### 3. Run the Frontend
Go to the `frontend` folder, install the packages, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to the local address (usually `http://localhost:5173` or `http://localhost:5174`).
