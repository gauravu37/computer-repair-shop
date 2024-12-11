import React, { useState, useEffect } from "react";
import { FaWallet, FaClock, FaCheckCircle } from "react-icons/fa";
import "../styles/Payments.css";
import Loading from "../components/Loading";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(
          "https://computer-repair-backend.onrender.com/api/jobs"
        );
        const data = await response.json();
        setPayments(data.jobs);
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error("Failed to fetch payments data:", err);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchPayments();
  }, []);

  const sortedPayments = payments.sort((a, b) => {
    if (a.paymentStatus === "Pending" && b.paymentStatus !== "Pending")
      return -1;
    if (b.paymentStatus === "Pending" && a.paymentStatus !== "Pending")
      return 1;
    return 0;
  });

  const totalAmount = sortedPayments.reduce(
    (acc, payment) => acc + parseFloat(payment.estimateCharges),
    0
  );
  const creditedAmount = sortedPayments
    .filter((payment) => payment.status === "Credited")
    .reduce((acc, payment) => acc + parseFloat(payment.estimateCharges), 0);
  const pendingAmount = totalAmount - creditedAmount;

  return (
    <div className="payments-section">
      {loading ? (
        <Loading /> // Show Loading component while data is being fetched
      ) : (
        <>
          {/* Summary Card */}
          <div className="payments-summary">
            <div className="summary-item total">
              <FaWallet className="icon" />
              <div className="summary-content">
                <h4>Total Amount</h4>
                <p>₹{totalAmount}</p>
              </div>
            </div>
            <div className="summary-item pending">
              <FaClock className="icon" />
              <div className="summary-content">
                <h4>Pending Amount</h4>
                <p>₹{pendingAmount}</p>
              </div>
            </div>
            <div className="summary-item credited">
              <FaCheckCircle className="icon" />
              <div className="summary-content">
                <h4>Cleared Amount</h4>
                <p>₹{creditedAmount}</p>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Delivery Date</th>
                <th>Amount</th>
                <th>Job Status</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment._id}</td>
                  <td>{formatDate(payment.estimateDeliveryDate)}</td>
                  <td>₹{payment.estimateCharges}</td>
                  <td className={payment.jobStatus.toLowerCase()}>
                    {payment.jobStatus}
                  </td>
                  <td>{payment.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Payments;
