# Employee Management System

A simple, clean, and fully-functional CRUD (Create, Read, Update, Delete) web application built for managing employee records.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Axios, HTML5, Vanilla CSS3 (Custom responsive styles, Modal animations).
- **Backend:** Node.js, Express.js, Mongoose (MongoDB).
- **Database:** MongoDB Atlas (Cloud Database) with a local JSON file fallback for offline/development environments.

---

## 🚀 Setup & Execution Instructions

Follow these steps to run the application locally on your computer:

### Prerequisite
Ensure you have [Node.js](https://nodejs.org/) installed.

### 1. Configure Environment Variables
Inside the `backend/` folder, a `.env` file should contain the database connection string and server port:
```env
MONGO_URI=mongodb+srv://abisabi:abi123@cluster0.yrpdfvy.mongodb.net/?appName=Cluster0
PORT=5000
```

### 2. Start the Backend Server
Navigate to the `backend/` folder, install the dependencies, and start the development server:
```bash
cd backend
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Start the Frontend Dashboard
Open a new terminal window, navigate to the `frontend/` folder, install the dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to the address shown in the terminal (usually `http://localhost:5173` or `http://localhost:5174`).

---

## ✨ Features Implemented

1. **Employee Directory (Read):** Displays a clean, hover-highlighted table of all employee records showing Emp No, Name, Designation, and Salary in Sri Lankan Rupees (LKR).
2. **Add Employee Modal (Create):** Open a modal form by clicking the top-right `+ Add Employee` button. 
   - **Auto-generated Employee Numbers:** The application automatically generates sequential Employee Numbers (e.g. `EMP-001`, `EMP-002`) on opening the modal to prevent duplicate entry issues.
3. **Edit Employee Modal (Update):** Click `Edit` on any employee row to edit their Name, Designation, and Salary. The unique Employee Number is locked from editing.
4. **Delete Employee (Delete):** Click `Delete` on any row to instantly remove the employee. Includes a confirmation popup before removal.
5. **Fail-Safe Offline Mode:** If the server cannot connect to the cloud MongoDB Atlas cluster (due to network restrictions or lack of internet), it automatically falls back to reading/writing to a local `data.json` file inside the `backend/` folder so the application remains 100% functional.
