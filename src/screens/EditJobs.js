import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import "../styles/EditJobs.css";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const EditJobs = () => {
  const location = useLocation();
  const [jobId, setJobId] = useState(location.state?.jobId || "");
  const [enteredJobId, setEnteredJobId] = useState("");
  const [jobData, setJobData] = useState({
    customer: "",
    jobDescription: "",
    estimateDeliveryDate: "",
    estimateCharges: "",
    notes: "",
    paymentStatus: "Pending",
    jobStatus: "Pending",
    dynamicFields: [],
  });
  const [newField, setNewField] = useState({ name: "", price: "" });
  const [customerData, setCustomerData] = useState(null);

  // Fetch job and customer data
  useEffect(() => {
    if (jobId) {
      fetch(`https://computer-repair-backend.onrender.com/api/jobs/${jobId}`)
        .then((res) => res.json())
        .then((data) => {
          setJobData({
            ...data.job,
            dynamicFields: Array.isArray(data.job.dynamicFields)
              ? data.job.dynamicFields
              : [],
          });
          const customerId = data.job.customer;
          if (customerId) {
            fetch(
              `https://computer-repair-backend.onrender.com/api/customers/${customerId}`
            )
              .then((res) => res.json())
              .then((data) => setCustomerData(data.customer))
              .catch((err) =>
                console.error("Error fetching customer data:", err)
              );
          }
        })
        .catch((err) => console.error("Error fetching job data:", err));
    }
  }, [jobId]);

  const handleDynamicFieldChange = (e) => {
    const { name, value } = e.target;
    setNewField((prev) => ({ ...prev, [name]: value }));
  };

  const addDynamicField = () => {
    if (newField.name && !isNaN(Number(newField.price)) && newField.price) {
      setJobData((prevData) => ({
        ...prevData,
        dynamicFields: [
          ...prevData.dynamicFields,
          { ...newField, price: Number(newField.price) },
        ],
      }));
      setNewField({ name: "", price: "" });
    } else {
      alert("Please enter a valid price");
    }
  };

  const removeDynamicField = (index) => {
    setJobData((prevData) => ({
      ...prevData,
      dynamicFields: prevData.dynamicFields.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(
      `https://computer-repair-backend.onrender.com/api/jobs/updatejob/${jobId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Job updated successfully") {
          alert("Job updated successfully!");
        } else {
          alert("Failed to update job: " + (data.message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Error updating job:", err);
        alert("An error occurred while updating the job.");
      });
  };

  const renderAddress = (address) => {
    return `${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.pincode}`;
  };

  const handleJobIdSubmit = () => {
    if (enteredJobId.trim()) {
      setJobId(enteredJobId.trim());
      setEnteredJobId("");
    }
  };

  if (!jobId) {
    return (
      <div className="edit-jobs-container">
        <h1>No Job Selected</h1>
        <p style={{ textAlign: "center" }}>Please enter job ID to edit.</p>
        <div className="job-id-input-container">
          <input
            type="text"
            className="job-id-input"
            value={enteredJobId}
            onChange={(e) => setEnteredJobId(e.target.value)}
            placeholder="Enter Job ID"
          />
          <button className="job-id-button" onClick={handleJobIdSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-jobs-container">
      <h1>Edit Job - {jobId}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label>Customer Id:</label>
          <input
            type="text"
            name="customerId"
            value={customerData?._id || ""}
            readOnly
            style={{ marginBottom: 14 }}
          />
          <label>Customer Name:</label>
          <input
            type="text"
            name="customerName"
            value={customerData?.name || ""}
            readOnly
            style={{ marginBottom: 14 }}
          />
          <label>Customer Email:</label>
          <input
            type="text"
            name="customerEmail"
            value={customerData?.email || ""}
            readOnly
            style={{ marginBottom: 14 }}
          />
          <label>Customer Phone:</label>
          <input
            type="text"
            name="customerPhone"
            value={customerData?.phone || ""}
            readOnly
            style={{ marginBottom: 14 }}
          />
          <label>Customer Address:</label>
          <input
            type="text"
            name="customerAddress"
            value={
              customerData?.address ? renderAddress(customerData.address) : ""
            }
            readOnly
            style={{ marginBottom: 14 }}
          />
          <label>Job Description:</label>
          <div
            style={{ marginBottom: 14 }}
            className="job-description"
            dangerouslySetInnerHTML={{ __html: jobData.jobDescription }}
          />
          <label>Estimate Delivery Date:</label>
          <input
            type="string"
            name="estimateDeliveryDate"
            value={formatDate(jobData.estimateDeliveryDate)}
            readOnly
            style={{ marginBottom: 14 }}
          />
          <label>Estimate Charges:</label>
          <input
            type="number"
            name="estimateCharges"
            value={jobData.estimateCharges}
            readOnly
            style={{ marginBottom: 14 }}
          />
          <label>Notes:</label>
          <textarea
            name="notes"
            value={jobData.notes}
            readOnly
            style={{
              marginBottom: 14,
              resize: "none",
              overflow: "hidden",
            }}
            rows={1}
            ref={(textarea) => {
              if (textarea) {
                textarea.style.height = "auto";
                textarea.style.height = `${textarea.scrollHeight}px`;
              }
            }}
          />
        </div>

        <div className="form-section">
          <label>Payment Status:</label>
          <select
            name="paymentStatus"
            value={jobData.paymentStatus}
            onChange={(e) =>
              setJobData({ ...jobData, paymentStatus: e.target.value })
            }
            style={{ marginBottom: 14 }}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
          </select>

          <label>Job Status:</label>
          <select
            name="jobStatus"
            value={jobData.jobStatus}
            onChange={(e) =>
              setJobData({ ...jobData, jobStatus: e.target.value })
            }
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>

        <h3 style={{ marginBottom: 7 }}>Replacements and Repairs</h3>
        {Array.isArray(jobData.dynamicFields) &&
          jobData.dynamicFields.map((field, index) => (
            <div key={index} className="dynamic-field">
              <span>{field.name}</span> -
              <span>
                ₹
                {isNaN(Number(field.price))
                  ? "Invalid Price"
                  : Number(field.price).toFixed(2)}
              </span>
              <button
                style={{ border: "none" }}
                type="button"
                onClick={() => removeDynamicField(index)}
                className="removeLogaBtn"
              >
                <FaTrash />
              </button>
            </div>
          ))}

        <div className="add-dynamic-field" style={{ marginBottom: 14 }}>
          <input
            type="text"
            name="name"
            placeholder="Service or part Name"
            value={newField.name}
            onChange={handleDynamicFieldChange}
            className="name-input"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newField.price}
            onChange={handleDynamicFieldChange}
            className="price-input"
          />
          <button
            className="addServiceOrPartBtn"
            type="button"
            onClick={addDynamicField}
          >
            <FaPlus />
          </button>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <button className="saveChangesBtn" type="submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJobs;
