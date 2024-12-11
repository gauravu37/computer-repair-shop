import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Customers.css";
import Loading from "../components/Loading"; // Import the Loading component

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: {
      street: "",
      pincode: "",
      city: "",
      state: "",
      country: "",
    },
  });
  const [editMode, setEditMode] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://computer-repair-backend.onrender.com/api/customers"
      );
      setCustomers(response.data.customers);
      console.log(response);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomerFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address")) {
      const field = name.split(".")[1];
      setCustomerForm((prevForm) => ({
        ...prevForm,
        address: {
          ...prevForm.address,
          [field]: value,
        },
      }));
    } else {
      setCustomerForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleCustomerFormSubmit = async () => {
    try {
      const response = await axios.post(
        "https://computer-repair-backend.onrender.com/api/customers",
        customerForm
      );
      if (response.status === 201) {
        alert("Customer added successfully!");
        setCustomerForm({
          name: "",
          phone: "",
          email: "",
          address: {
            street: "",
            pincode: "",
            city: "",
            state: "",
            country: "",
          },
        });
        setModalVisible(false);
      }
      fetchCustomers();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const toggleCustomerForm = () => {
    setModalVisible(!modalVisible);
  };

  const handleEditButtonClick = (customer) => {
    setCustomerForm(customer);
    setCurrentCustomerId(customer._id);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleUpdateCustomer = async () => {
    try {
      const response = await axios.patch(
        `https://computer-repair-backend.onrender.com/api/customers/${currentCustomerId}`,
        customerForm
      );
      if (response.status === 200) {
        alert("Customer updated successfully!");
        fetchCustomers();
        resetForm();
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleDeleteCustomer = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `https://computer-repair-backend.onrender.com/api/customers/${currentCustomerId}`
        );
        alert("Customer deleted successfully!");
        fetchCustomers();
        resetForm();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    } else {
      console.log("Delete action canceled");
    }
  };

  const resetForm = () => {
    setCustomerForm({
      name: "",
      phone: "",
      email: "",
      address: {
        street: "",
        pincode: "",
        city: "",
        state: "",
        country: "",
      },
    });
    setModalVisible(false);
    setEditMode(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="customers-section">
      <div className="customer-header">
        <div>
          <h1>Customers</h1>
          <span className="count-badge">{filteredCustomers.length}</span>
        </div>
        <button
          type="button"
          className="add-customer-button"
          onClick={toggleCustomerForm}
        >
          Add New Customer
        </button>
      </div>
      <input
        type="text"
        placeholder="Search customer by name or email"
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table className="customers-table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Registration Date</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer._id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{formatDate(customer.createdAt)}</td>
              <td>{customer.address.city}</td>
              <td>
                <button onClick={() => handleEditButtonClick(customer)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Customer</h2>
            <div className="new-customer-form">
              <input
                type="text"
                name="name"
                placeholder="Name (required)"
                className="form-input"
                required
                value={customerForm.name}
                onChange={handleCustomerFormChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone (required)"
                className="form-input"
                required
                value={customerForm.phone}
                onChange={handleCustomerFormChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-input"
                value={customerForm.email}
                onChange={handleCustomerFormChange}
              />
              <input
                type="text"
                name="address.street"
                placeholder="Street"
                className="form-input"
                value={customerForm.address.street}
                onChange={handleCustomerFormChange}
              />
              <input
                type="text"
                name="address.pincode"
                placeholder="Pincode"
                className="form-input"
                value={customerForm.address.pincode}
                onChange={handleCustomerFormChange}
              />
              <input
                type="text"
                name="address.city"
                placeholder="City"
                className="form-input"
                value={customerForm.address.city}
                onChange={handleCustomerFormChange}
              />
              <input
                type="text"
                name="address.state"
                placeholder="State"
                className="form-input"
                value={customerForm.address.state}
                onChange={handleCustomerFormChange}
              />
              <input
                type="text"
                name="address.country"
                placeholder="Country"
                className="form-input"
                value={customerForm.address.country}
                onChange={handleCustomerFormChange}
              />
              <button
                type="button"
                className="cancel-button"
                onClick={toggleCustomerForm}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-button"
                onClick={handleCustomerFormSubmit}
              >
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editMode ? "Edit Customer" : "Add New Customer"}</h2>
            <div className="new-customer-form">
              <input
                type="text"
                name="name"
                placeholder="Name (required)"
                className="form-input"
                required
                value={customerForm.name}
                onChange={handleCustomerFormChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone (required)"
                className="form-input"
                required
                value={customerForm.phone}
                onChange={handleCustomerFormChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-input"
                value={customerForm.email}
                onChange={handleCustomerFormChange}
              />
              <input
                type="text"
                name="address.street"
                placeholder="Street"
                className="form-input"
                value={customerForm.address.street}
                onChange={handleCustomerFormChange}
              />
              <input
                type="text"
                name="address.pincode"
                placeholder="Pincode"
                className="form-input"
                value={customerForm.address.pincode}
                onChange={handleCustomerFormChange}
              />
              <input
                type="text"
                name="address.city"
                placeholder="City"
                className="form-input"
                value={customerForm.address.city}
                onChange={handleCustomerFormChange}
              />
              <input
                type="text"
                name="address.state"
                placeholder="State"
                className="form-input"
                value={customerForm.address.state}
                onChange={handleCustomerFormChange}
              />
              <input
                type="text"
                name="address.country"
                placeholder="Country"
                className="form-input"
                value={customerForm.address.country}
                onChange={handleCustomerFormChange}
              />
              {editMode ? (
                <>
                  <button
                    type="button"
                    className="submit-button"
                    onClick={handleUpdateCustomer}
                    style={{ backgroundColor: "#222f3c" }}
                  >
                    Update Customer
                  </button>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={handleDeleteCustomer}
                    style={{ backgroundColor: "red" }}
                  >
                    Delete Customer
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="submit-button"
                  onClick={handleCustomerFormSubmit}
                >
                  Save Customer
                </button>
              )}
              <button
                type="button"
                className="cancel-button"
                onClick={resetForm} // Use reset function for cancel action
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
