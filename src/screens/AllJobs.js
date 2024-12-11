import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const AllJobs = () => {
  const navigate = useNavigate();
  const [customerDetails, setCustomerDetails] = useState({});
  const [jobs, setJobs] = useState([]);
  const [expandedJob, setExpandedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://computer-repair-backend.onrender.com/api/jobs"
      );
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleJobDetails = async (jobId, customerId) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
      return;
    }

    if (!customerDetails[customerId]) {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://computer-repair-backend.onrender.com/api/customers/${customerId}`
        );
        setCustomerDetails((prev) => ({
          ...prev,
          [customerId]: response.data.customer,
        }));
      } catch (error) {
        console.error("Error fetching customer details:", error);
      } finally {
        setLoading(false);
      }
    }

    setExpandedJob(jobId);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="customers-section">
      <div className="customer-header">
        <div>
          <h1>Jobs</h1>
          <span className="count-badge">{jobs.length}</span>
        </div>
        <button
          type="button"
          className="add-customer-button"
          onClick={() => navigate("/repairjobs")}
        >
          Add New Job
        </button>
      </div>
      <table className="customers-table">
        <thead>
          <tr>
            <th>Job Id</th>
            <th>Delivery Date</th>
            <th>Charges</th>
            <th>Job Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <React.Fragment key={job._id}>
              <tr>
                <td>{job._id}</td>
                <td>{formatDate(job.estimateDeliveryDate)}</td>
                <td>₹{job.estimateCharges}</td>
                <td>{job.jobStatus}</td>
                <td>
                  <button
                    className="view-details-button"
                    onClick={() => toggleJobDetails(job._id, job.customer)}
                  >
                    {expandedJob === job._id ? "Hide Details" : "View Details"}
                  </button>
                  <button
                    className="edit-job-button"
                    style={{ marginLeft: "10px" }}
                    onClick={() =>
                      navigate(`/editjobs`, { state: { jobId: job._id } })
                    }
                  >
                    Edit
                  </button>
                </td>
              </tr>
              {expandedJob === job._id && (
                <tr className="job-details-row">
                  <td colSpan="5">
                    <div className="job-details">
                      <h3
                        style={{
                          textAlign: "center",
                          marginBottom: 10,
                          borderBottom: "2px solid rgb(227, 227, 227)",
                        }}
                      >
                        Job Details
                      </h3>
                      {customerDetails[job.customer] ? (
                        <>
                          <p>
                            <strong style={{ color: "black" }}>
                              Customer Details:
                            </strong>{" "}
                            {`${customerDetails[job.customer].name}, ${
                              customerDetails[job.customer].phone
                            }, ${customerDetails[job.customer].email || "N/A"}`}
                          </p>

                          <p>
                            <strong style={{ color: "black" }}>
                              Payment Status:
                            </strong>{" "}
                            {job.paymentStatus}
                            {", "}
                            <strong style={{ color: "black" }}>
                              Job Status:
                            </strong>{" "}
                            {job.jobStatus}
                          </p>

                          <p>
                            <strong style={{ color: "black" }}>Address:</strong>{" "}
                            {`${
                              customerDetails[job.customer].address.street
                            }, ${customerDetails[job.customer].address.city}, ${
                              customerDetails[job.customer].address.state
                            } - ${
                              customerDetails[job.customer].address.pincode
                            }, ${
                              customerDetails[job.customer].address.country
                            }`}
                          </p>
                        </>
                      ) : (
                        <Loading />
                      )}
                      <p>
                        <strong style={{ color: "black" }}>
                          Job Description:
                        </strong>{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: job.jobDescription,
                          }}
                        />
                      </p>

                      <p>
                        <strong style={{ color: "black" }}>Notes:</strong>{" "}
                        {job.notes || "N/A"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllJobs;
