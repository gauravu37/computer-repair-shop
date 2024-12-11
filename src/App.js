import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import Auth from "./screens/Auth";
import { useAuth } from "./AuthContext";

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {isAuthenticated ? (
        <>
          <Sidebar isSidebarOpen={isSidebarOpen} />
          <Content
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={handleSidebarToggle}
          />
        </>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
