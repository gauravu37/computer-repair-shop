import React from "react";
import "../styles/Home.css";
import {
  FaCartPlus,
  FaMoneyBillAlt,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dummy data for sales, earnings, orders, visitors, and order history
const salesData = {
  totalSales: 10000,
  totalEarnings: 1000,
  totalOrders: 100,
  totalVisitors: 100000,
  salesGraphData: [
    1000, 2000, 3000, 2500, 1500, 4000, 3000, 2000, 3500, 4000, 5000, 4500,
  ],
  orderHistory: [
    {
      orderId: "0zopa76dgwt5ahj38",
      productName: "Laptop",
      problem: "Broken Screen",
      date: "12-11-2024",
    },
    {
      orderId: "0aa77a7hw8nskx0q",
      productName: "Keyboard",
      problem: "Keys not working",
      date: "13-11-2024",
    },
    {
      orderId: "0hh6as6tvy6svsysu",
      productName: "Mouse",
      problem: "Not responding",
      date: "10-11-2024",
    },
  ],
};

const Home = () => {
  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Sales (₹)",
        data: salesData.salesGraphData,
        borderColor: "#222f3c",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Monthly Sales (₹1000 to ₹5000)",
      },
    },
  };

  return (
    <div className="dashboard">
      <div className="dashboardTop">
        <div className="card-container">
          <div className="card">
            <div className="card-header">
              <FaCartPlus size={20} /> Total Sales
            </div>
            <div className="card-body">₹{salesData.totalSales}</div>
          </div>

          <div className="card">
            <div className="card-header">
              <FaMoneyBillAlt size={20} /> Total Earnings
            </div>
            <div className="card-body">₹{salesData.totalEarnings}</div>
          </div>

          <div className="card">
            <div className="card-header">
              <FaChartLine size={20} /> Total Orders
            </div>
            <div className="card-body">{salesData.totalOrders}</div>
          </div>

          <div className="card">
            <div className="card-header">
              <FaUsers size={20} /> Total Visitors
            </div>
            <div className="card-body">{salesData.totalVisitors}</div>
          </div>
        </div>

        <div className="graph">
          <div>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="table-container">
        <h3>Latest Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product Name</th>
              <th>Problem</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {salesData.orderHistory.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.productName}</td>
                <td>{order.problem}</td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
