// import React, { useState } from "react";
// import "../styles/GenerateInvoice.css";

// const GenerateInvoice = () => {
//   const [jobId, setJobId] = useState("");
//   const [jobData, setJobData] = useState(null);
//   const [customerData, setCustomerData] = useState(null);

//   const handleJobIdChange = (e) => {
//     setJobId(e.target.value);
//   };

//   const fetchJobData = () => {
//     if (!jobId) {
//       alert("Please enter a valid Job ID.");
//       return;
//     }

//     fetch(`https://computer-repair-backend.onrender.com/api/jobs/${jobId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setJobData(data.job);
//         const customerId = data.job.customer;
//         if (customerId) {
//           fetch(
//             `https://computer-repair-backend.onrender.com/api/customers/${customerId}`
//           )
//             .then((res) => res.json())
//             .then((customerData) => setCustomerData(customerData.customer))
//             .catch((err) => {
//               console.error(err);
//             });
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const handlePrint = () => {
//     window.print(); // This triggers the print dialog
//   };

//   return (
//     <div className="generate-invoice-container">
//       <h1>Generate Invoice</h1>
//       <div className="job-id-input-container">
//         <input
//           type="text"
//           className="job-id-input"
//           value={jobId}
//           onChange={handleJobIdChange}
//           placeholder="Enter Job ID"
//         />
//         <button className="fetch-data-button" onClick={fetchJobData}>
//           Generate
//         </button>
//       </div>

//       {jobData && customerData && (
//         <div className="invoice-details">
//           <div className="customer-info">
//             <h2>Customer Information</h2>
//             <p>
//               <strong>Name:</strong> {customerData.name}
//             </p>
//             <p>
//               <strong>Email:</strong> {customerData.email}
//             </p>
//             <p>
//               <strong>Phone:</strong> {customerData.phone}
//             </p>
//             <p>
//               <strong>Address:</strong>{" "}
//               {customerData.address
//                 ? `${customerData.address.street}, ${customerData.address.city}, ${customerData.address.state}`
//                 : "N/A"}
//             </p>
//           </div>

//           <div className="job-info">
//             <h2>Job Details</h2>
//             <p>
//               <strong>Description:</strong>
//             </p>
//             <div
//               className="job-description"
//               dangerouslySetInnerHTML={{ __html: jobData.jobDescription }}
//             />
//             <p>
//               <strong>Estimate Delivery Date:</strong>{" "}
//               {formatDate(jobData.estimateDeliveryDate)}
//             </p>
//             <p>
//               <strong>Estimate Charges:</strong> ₹{jobData.estimateCharges}
//             </p>
//             <p>
//               <strong>Payment Status:</strong> {jobData.paymentStatus}
//             </p>
//             <p>
//               <strong>Job Status:</strong> {jobData.jobStatus}
//             </p>
//           </div>

//           <div className="dynamic-fields">
//             <h3>Replacements and Repairs</h3>
//             {Array.isArray(jobData.dynamicFields) &&
//             jobData.dynamicFields.length > 0 ? (
//               jobData.dynamicFields.map((field, index) => (
//                 <div key={index} className="dynamic-field">
//                   <span>
//                     {field.name} - ₹{field.price}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <p>No dynamic fields available</p>
//             )}
//           </div>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <button className="print-button" onClick={handlePrint}>
//               Print Now
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GenerateInvoice;

import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/GenerateInvoice.css";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const GenerateInvoice = () => {
  const [jobId, setJobId] = useState("");
  const [jobData, setJobData] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  const handleJobIdChange = (e) => {
    setJobId(e.target.value);
  };

  const fetchJobData = () => {
    if (!jobId) {
      alert("Please enter a valid Job ID.");
      return;
    }

    fetch(`https://computer-repair-backend.onrender.com/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        setJobData(data.job);
        const customerId = data.job.customer;
        if (customerId) {
          fetch(
            `https://computer-repair-backend.onrender.com/api/customers/${customerId}`
          )
            .then((res) => res.json())
            .then((customerData) => setCustomerData(customerData.customer))
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(30);
    doc.text("Computer Repair Shop", 105, 20, { align: "center" });
    doc.setFontSize(12);

    doc.text(
      "207, Vasan Udyog Bhavan, Lower Parel, Mumbai, Maharashtra 400013",
      105,
      30,
      { align: "center" }
    );

    doc.text(`Invoice ID: ${jobData._id}`, 16, 45);
    doc.text(`Date: ${formatDate(jobData.estimateDeliveryDate)}`, 120, 45);
    doc.text(`Customer: ${customerData.name}`, 16, 53);
    doc.text(`Mobile: ${customerData.phone}`, 120, 53);
    doc.text(`GSTIN: 1234567890`, 16, 61);

    const customerAddress = customerData.address
      ? `Address: ${customerData.address.street}, ${customerData.address.city}, ${customerData.address.state}, ${customerData.address.country}, ${customerData.address.pincode}`
      : "N/A";

    const addressYPosition = handleLongText(doc, customerAddress, 120, 61);

    // Notes
    doc.text(`Notes: ${jobData.notes}`, 16, addressYPosition);

    // Table Header
    const tableColumn = ["Sr.No", "Description", "9% CGST", "9% SGST", "Price"];
    const tableRows = jobData.dynamicFields.map((field, index) => {
      const price = field.price;
      const cgst = (price * 0.09).toFixed(2);
      const sgst = (price * 0.09).toFixed(2);

      return [index + 1, field.name, `${cgst}`, `${sgst}`, `${price}`];
    });

    // Create Table
    doc.autoTable(tableColumn, tableRows, {
      startY: addressYPosition + 5,
      margin: { top: 10 },
      bodyStyles: { valign: "top" },
      styles: {
        overflow: "linebreak",
        cellWidth: "auto",
      },
      didDrawPage: function (data) {
        doc.setTextColor(0, 0, 0);
      },
    });

    // Total Calculation
    const totalGSTAmount = tableRows.reduce(
      (acc, row) =>
        acc +
        parseFloat(row[2].replace("₹", "")) +
        parseFloat(row[3].replace("₹", "")),
      0
    );

    const totalPrice = tableRows.reduce(
      (acc, row) => acc + parseFloat(row[4].replace("₹", "")),
      0
    );

    // Total Details
    doc.text(
      `18% GST: ${totalGSTAmount.toFixed(2)}`,
      150,
      doc.autoTable.previous.finalY + 10
    );

    doc.text(
      `Total Price: ${totalPrice.toFixed(2)}`,
      150,
      doc.autoTable.previous.finalY + 20
    );

    // Thank You Message
    doc.setFontSize(10);
    doc.text(
      "Thank You for Choosing Our Service!",
      105,
      doc.autoTable.previous.finalY + 30,
      { align: "center" }
    );

    // Save the PDF
    doc.save("invoice.pdf");
  };

  const handleLongText = (doc, text, xPosition, yPosition) => {
    const splitText = doc.splitTextToSize(text, 80);
    const textHeight = splitText.length * 6;

    splitText.forEach((line, index) => {
      doc.text(line, xPosition, yPosition + index * 6);
    });

    return yPosition + textHeight;
  };

  return (
    <div className="generate-invoice-container">
      <h1>Generate Invoice</h1>
      <div className="job-id-input-container">
        <input
          type="text"
          className="job-id-input"
          value={jobId}
          onChange={handleJobIdChange}
          placeholder="Enter Job ID"
        />
        <button className="fetch-data-button" onClick={fetchJobData}>
          Generate
        </button>
      </div>

      {jobData && customerData && (
        <div className="invoice-details">
          <div className="customer-info">
            <h2>Customer Information</h2>
            <p>
              <strong>Name:</strong> {customerData.name}
            </p>
            <p>
              <strong>Email:</strong> {customerData.email}
            </p>
            <p>
              <strong>Phone:</strong> {customerData.phone}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {customerData.address
                ? `${customerData.address.street}, ${customerData.address.city}, ${customerData.address.state}`
                : "N/A"}
            </p>
          </div>

          <div className="job-info">
            <h2>Job Details</h2>
            <p>
              <strong>Description:</strong>
            </p>
            <div
              className="job-description"
              dangerouslySetInnerHTML={{ __html: jobData.jobDescription }}
            />
            <p>
              <strong>Estimate Delivery Date:</strong>{" "}
              {formatDate(jobData.estimateDeliveryDate)}
            </p>
            <p>
              <strong>Estimate Charges:</strong> ₹{jobData.estimateCharges}
            </p>
            <p>
              <strong>Payment Status:</strong> {jobData.paymentStatus}
            </p>
            <p>
              <strong>Job Status:</strong> {jobData.jobStatus}
            </p>
          </div>

          <div className="dynamic-fields">
            <h3>Replacements and Repairs</h3>
            {Array.isArray(jobData.dynamicFields) &&
            jobData.dynamicFields.length > 0 ? (
              jobData.dynamicFields.map((field, index) => (
                <div key={index} className="dynamic-field">
                  <span>
                    {field.name} - ₹{field.price}
                  </span>
                </div>
              ))
            ) : (
              <p>No dynamic fields available</p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button className="print-button" onClick={handleGeneratePDF}>
              Generate PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateInvoice;
