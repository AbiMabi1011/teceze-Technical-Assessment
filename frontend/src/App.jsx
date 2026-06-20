import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // 1. State definitions
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeNo: '',
    employeeName: '',
    designation: '',
    salary: ''
  });
  const [isEditing, setIsEditing] = useState(null); // Stores the _id of the employee being edited, or null
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls visibility of the Add/Edit form modal
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/employees';

  // 2. Fetch all employees from the backend when the component loads
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Could not connect to the database/server.');
    }
  };

  // 3. Handle change inside input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 4. Create or Update Employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.employeeNo || !formData.employeeName || !formData.designation || !formData.salary) {
      setError('All fields are required.');
      return;
    }

    if (Number(formData.salary) <= 0) {
      setError('Salary must be a positive number.');
      return;
    }

    try {
      if (isEditing) {
        // Update operation (PUT)
        await axios.put(`${API_URL}/${isEditing}`, formData);
        setSuccess('Employee updated successfully!');
      } else {
        // Create operation (POST)
        await axios.post(API_URL, formData);
        setSuccess('Employee added successfully!');
      }

      // Close modal, reset form and re-fetch list
      setIsModalOpen(false);
      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error('Error saving employee:', err);
      if (err.response && err.response.data && err.response.data.code === 11000) {
        setError('Employee Number must be unique.');
      } else {
        setError('Failed to save employee. Please try again.');
      }
    }
  };

  // 5. Populate form and open modal for editing
  const handleEdit = (employee) => {
    setIsEditing(employee._id);
    setFormData({
      employeeNo: employee.employeeNo,
      employeeName: employee.employeeName,
      designation: employee.designation,
      salary: employee.salary
    });
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  // 6. Open modal for adding a new employee
  const handleAddClick = () => {
    resetForm();
    setError('');
    setSuccess('');

    // Auto-generate Employee Number (e.g. EMP-001, EMP-002, etc.)
    let nextNum = 1;
    if (employees.length > 0) {
      const numbers = employees.map(emp => {
        const match = String(emp.employeeNo).match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      });
      nextNum = Math.max(...numbers) + 1;
    }
    const paddedNum = String(nextNum).padStart(3, '0');

    setFormData({
      employeeNo: `EMP-${paddedNum}`,
      employeeName: '',
      designation: '',
      salary: ''
    });
    setIsModalOpen(true);
  };

  // 7. Delete Employee
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccess('Employee deleted successfully!');
        fetchEmployees();
        // If we are currently editing the deleted employee, close modal and reset form
        if (isEditing === id) {
          resetForm();
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error('Error deleting employee:', err);
        setError('Failed to delete employee.');
      }
    }
  };

  // Helper to clear form state
  const resetForm = () => {
    setFormData({
      employeeNo: '',
      employeeName: '',
      designation: '',
      salary: ''
    });
    setIsEditing(null);
  };

  const handleCancel = () => {
    resetForm();
    setIsModalOpen(false);
    setError('');
  };

  return (
    <div className="container">
      <header className="header">
        <div className="header-top">
          <h1>Employee Management System</h1>
          <button onClick={handleAddClick} className="btn-add-main">
            + Add Employee
          </button>
        </div>

      </header>

      {/* Messages */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Directory Table */}
      <section className="table-section">
        <h2>Employee Directory</h2>
        {employees.length === 0 ? (
          <p className="no-data">No employees found. Click "+ Add Employee" to get started!</p>
        ) : (
          <div className="table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Emp No</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.employeeNo}</td>
                    <td>{emp.employeeName}</td>
                    <td>{emp.designation}</td>
                    <td>LKR {Number(emp.salary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(emp)}
                        className="btn-action btn-edit"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="btn-action btn-delete"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 8. Add / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Employee Record' : 'Add New Employee'}</h2>
              <button type="button" className="btn-close-modal" onClick={handleCancel}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-group">
                <label htmlFor="employeeNo">Employee No:</label>
                <input
                  type="text"
                  id="employeeNo"
                  name="employeeNo"
                  value={formData.employeeNo}
                  onChange={handleChange}
                  placeholder="Auto-generated"
                  disabled={true} // Always disabled so it is auto-managed
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="employeeName">Employee Name:</label>
                <input
                  type="text"
                  id="employeeName"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="designation">Designation:</label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary">Salary (LKR):</label>
                <input
                  type="number"
                  step="0.01"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 50000.00"
                  required
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save Changes' : 'Create Employee'}
                </button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
