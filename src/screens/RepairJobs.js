import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill styling
import "../styles/RepairJobs.css";
import axios from "axios";

const RepairJobs = () => {
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [estimateDeliveryDate, setEstimateDeliveryDate] = useState("");
  const [estimateCharges, setEstimateCharges] = useState("");
  const [notes, setNotes] = useState("");
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
  const [customers, setCustomers] = useState([]); // State to store fetched customers
  const [selectedCustomer, setSelectedCustomer] = useState(""); // State for selected customer

  const fetchData = async () => {
    try {
      const customersResponse = await axios.get(
        "https://computer-repair-backend.onrender.com/api/customers"
      );

      setCustomers(customersResponse.data.customers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleCustomerForm = () => setIsAddingCustomer(!isAddingCustomer);

  const handleJobDescriptionChange = (value) => {
    setJobDescription(value);
  };

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
      }
      fetchData();
      toggleCustomerForm();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  // Handle Job form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobData = {
      customer: selectedCustomer || customerForm._id,
      jobDescription,
      estimateDeliveryDate,
      estimateCharges: parseFloat(estimateCharges),
      notes,
    };

    try {
      const response = await axios.post(
        "https://computer-repair-backend.onrender.com/api/jobs",
        jobData
      );
      if (response.status === 201) {
        alert("Job added successfully!");
        fetchData();
        setJobDescription("");
        setEstimateDeliveryDate("");
        setEstimateCharges("");
        setNotes("");
        setSelectedCustomer("");
      }
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  return (
    <div className="repair-jobs-container">
      <h1 className="form-title">Add New Job</h1>
      <form className="repair-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <label htmlFor="customer" className="form-label">
            Customer
          </label>
          {!isAddingCustomer ? (
            <>
              <select
                id="customer"
                className="form-input"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="" disabled>
                  Select Customer
                </option>
                {/* Dynamically populate the customer dropdown */}
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="add-customer-button"
                onClick={toggleCustomerForm}
              >
                Add New Customer
              </button>
            </>
          ) : (
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
          )}
        </div>

        {/* Job Description */}
        <div className="form-section">
          <label htmlFor="job-description" className="form-label">
            Job Description
          </label>
          <ReactQuill
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            className="quill-editor"
            placeholder="Describe the issue or items to replace"
          />
        </div>

        {/* Estimate Details */}
        <div className="form-section">
          <label htmlFor="estimate-date" className="form-label">
            Estimate Delivery Date
          </label>
          <input
            type="date"
            id="estimate-date"
            className="form-input"
            value={estimateDeliveryDate}
            onChange={(e) => setEstimateDeliveryDate(e.target.value)}
          />
        </div>
        <div className="form-section">
          <label htmlFor="estimate-charges" className="form-label">
            Estimate Charges
          </label>
          <input
            type="text"
            id="estimate-charges"
            placeholder="Enter amount"
            className="form-input"
            value={estimateCharges}
            onChange={(e) => setEstimateCharges(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="form-section">
          <label htmlFor="notes" className="form-label">
            Notes
          </label>
          <textarea
            id="notes"
            placeholder="Any additional information"
            className="form-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="submit-button">
          Save Job
        </button>
      </form>
    </div>
  );
};

export default RepairJobs;
