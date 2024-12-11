import React, { useEffect, useState } from "react";
import "../styles/Employee.css";
import Loading from "../components/Loading"; // Import the Loading component

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // State to track loading
  const [modalOpen, setModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      pincode: "",
      city: "",
      state: "",
      country: "",
    },
    hiredOn: "",
  });

  // Fetch employees from the backend API
  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        "https://computer-repair-backend.onrender.com/api/employees"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEmployees(data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async () => {
    try {
      const response = await fetch(
        "https://computer-repair-backend.onrender.com/api/employees",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEmployee),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      fetchEmployees();
      setNewEmployee({
        name: "",
        email: "",
        phone: "",
        address: {
          street: "",
          pincode: "",
          city: "",
          state: "",
          country: "",
        },
        hiredOn: "",
      });
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="employee-section">
      {loading ? ( // Show the Loading component if data is still being fetched
        <Loading />
      ) : (
        <>
          <div className="employee-header">
            <div>
              <h1>Employees</h1>
              <span className="count-badge">{filteredEmployees.length}</span>
            </div>
            <button
              className="add-employee-btn"
              onClick={() => setModalOpen(true)}
            >
              Add Employee
            </button>
          </div>

          <input
            type="text"
            placeholder="Search employees by name or email"
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Hire Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee._id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>{formatDate(employee.hiredOn)}</td>
                  <td>
                    <button className="terminate-btn">Terminate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {modalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Add New Employee</h2>
                <input
                  type="text"
                  placeholder="Name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newEmployee.phone}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, phone: e.target.value })
                  }
                />
                <input
                  type="date"
                  placeholder="Hire Date"
                  value={newEmployee.hiredOn}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, hiredOn: e.target.value })
                  }
                />
                {/* Address Fields */}
                <input
                  type="text"
                  placeholder="Street"
                  value={newEmployee.address.street}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      address: {
                        ...newEmployee.address,
                        street: e.target.value,
                      },
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newEmployee.address.pincode}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      address: {
                        ...newEmployee.address,
                        pincode: e.target.value,
                      },
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newEmployee.address.city}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      address: {
                        ...newEmployee.address,
                        city: e.target.value,
                      },
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newEmployee.address.state}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      address: {
                        ...newEmployee.address,
                        state: e.target.value,
                      },
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={newEmployee.address.country}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      address: {
                        ...newEmployee.address,
                        country: e.target.value,
                      },
                    })
                  }
                />
                <button onClick={addEmployee}>Add Employee</button>
                <button
                  className="cancelbtn"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Employee;
