import React, { useState } from "react";
import "../styles/Content.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import { FiBell } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";

import Home from "../screens/Home";
import Customers from "../screens/Customers";
import RepairJob from "../screens/RepairJobs";
import Employee from "../screens/Employee";
import Profile from "../screens/Profile";

import { useAuth } from "../AuthContext";
import Payments from "../screens/Payments";
import AllJobs from "../screens/AllJobs";
import EditJobs from "../screens/EditJobs";
import GenerateInvoice from "../screens/GenerateInvoice";

const Content = ({ isSidebarOpen, onSidebarToggle }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to determine if a menu item is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className={`content ${isSidebarOpen ? "" : "full-width"}`}>
      <header className="header">
        <div className="toggle-icon" onClick={onSidebarToggle}>
          {isSidebarOpen ? (
            <RxCross1 size={28} />
          ) : (
            <RxHamburgerMenu size={28} />
          )}
        </div>

        <nav className="menu-items">
          <ul>
            <li
              className={`menu-item ${isActive("/") ? "active" : ""}`}
              onClick={() => navigate("/")}
            >
              Dashboard
              <span
                className={`underline ${
                  isActive("/") ? "active-underline" : ""
                }`}
              ></span>
            </li>
            <li
              className={`menu-item ${isActive("/customers") ? "active" : ""}`}
              onClick={() => navigate("/customers")}
            >
              Customers
              <span
                className={`underline ${
                  isActive("/customers") ? "active-underline" : ""
                }`}
              ></span>
            </li>
            <li
              className={`menu-item ${isActive("/repairjobs") ? "active" : ""}`}
              onClick={() => navigate("/repairjobs")}
            >
              Jobs
              <span
                className={`underline ${
                  isActive("/repairjobs") ? "active-underline" : ""
                }`}
              ></span>
            </li>
            <li
              className={`menu-item ${isActive("/employees") ? "active" : ""}`}
              onClick={() => navigate("/employees")}
            >
              Employees
              <span
                className={`underline ${
                  isActive("/employees") ? "active-underline" : ""
                }`}
              ></span>
            </li>
            <li
              className={`menu-item ${isActive("/payments") ? "active" : ""}`}
              onClick={() => navigate("/payments")}
            >
              Payments
              <span
                className={`underline ${
                  isActive("/payments") ? "active-underline" : ""
                }`}
              ></span>
            </li>
          </ul>
        </nav>

        <input type="text" className="search-barss" placeholder="Search..." />

        <div className="notification-icon">
          <FiBell size={24} />
          <span className="notification-count">0</span>
        </div>

        <div className="account-icon" onClick={toggleDropdown}>
          <MdAccountCircle size={30} />
          {isDropdownOpen && (
            <div className="dropdown-menus">
              <p onClick={() => navigate("/profile")}>Profile</p>
              <p
                onClick={() => logout()}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </header>

      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/repairjobs" element={<RepairJob />} />
          <Route path="/editjobs" element={<EditJobs />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route path="/generateinvoice" element={<GenerateInvoice />} />
          <Route path="/employees" element={<Employee />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </div>
    </div>
  );
};

export default Content;
