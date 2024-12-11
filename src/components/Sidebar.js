import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import Logo from "../assets/logo.png";
import { GoHomeFill } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { FaUserTie } from "react-icons/fa6";
import { FaMoneyBillAlt } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import {
  FaPlus,
  FaEdit,
  FaList,
  FaChevronDown,
  FaChevronUp,
  FaFileInvoice,
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`sidebar ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
    >
      <div className="logo">
        <img src={Logo} alt="logo" />
        <h2>Computer Repair Shop</h2>
      </div>
      <ul className="menu">
        <li
          onClick={() => navigate("/")}
          className={isActive("/") ? "active" : ""}
        >
          <GoHomeFill size={20} style={{ marginRight: 10 }} /> Dashboard
        </li>
        <li
          onClick={() => navigate("/customers")}
          className={isActive("/customers") ? "active" : ""}
        >
          <FaUser size={20} style={{ marginRight: 10 }} />
          Customers
        </li>
        <li
          onClick={() => setIsJobsDropdownOpen(!isJobsDropdownOpen)}
          className="dropdown"
        >
          <div className="menu-item">
            <GiAutoRepair size={20} style={{ marginRight: 10 }} />
            Jobs
            <span className="arrow">
              {isJobsDropdownOpen ? (
                <FaChevronUp size={15} />
              ) : (
                <FaChevronDown size={15} />
              )}
            </span>
          </div>
        </li>

        {isJobsDropdownOpen && (
          <ul className="dropdown-menu">
            <li
              onClick={() => navigate("/repairjobs")}
              className={isActive("/repairjobs") ? "active" : ""}
            >
              <FaPlus size={20} style={{ marginRight: 10 }} />
              Add Job
            </li>
            <li
              onClick={() => navigate("/editjobs")}
              className={isActive("/editjobs") ? "active" : ""}
            >
              <FaEdit size={20} style={{ marginRight: 10 }} />
              Edit Job
            </li>
            <li
              onClick={() => navigate("/jobs")}
              className={isActive("/jobs") ? "active" : ""}
            >
              <FaList size={20} style={{ marginRight: 10 }} />
              All Jobs
            </li>
            <li
              onClick={() => navigate("/generateinvoice")}
              className={isActive("/generateinvoice") ? "active" : ""}
            >
              <FaFileInvoice size={20} style={{ marginRight: 10 }} />
              Generate Invoice
            </li>
          </ul>
        )}
        <li
          onClick={() => navigate("/employees")}
          className={isActive("/employees") ? "active" : ""}
        >
          <FaUserTie size={20} style={{ marginRight: 10 }} />
          Employees
        </li>
        <li
          onClick={() => navigate("/payments")}
          className={isActive("/payments") ? "active" : ""}
        >
          <FaMoneyBillAlt size={20} style={{ marginRight: 10 }} />
          Payments
        </li>
        <li className="logoutLi">
          <IoLogOut size={20} style={{ marginRight: 10 }} color="red" />
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
