import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../components/admin/Dashboard';
import OrderManagement from '../components/admin/OrderManagement';
import MenuManagement from '../components/admin/MenuManagement';
import OutletManagement from '../components/admin/OutletManagement';
import Analytics from '../components/admin/Analytics';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-dashboard-container">
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button className="close-sidebar" onClick={toggleSidebar}>×</button>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </NavLink>
          <NavLink to="/admin/orders" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-shopping-bag"></i> Orders
          </NavLink>
          <NavLink to="/admin/outlets" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-store"></i> Outlets
          </NavLink>
          <NavLink to="/admin/menu" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-utensils"></i> Menu
          </NavLink>
          <NavLink to="/admin/analytics" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-chart-line"></i> Analytics
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        <div className="admin-header">
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <h1>Admin Dashboard</h1>
        </div>
        
        <div className="admin-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/outlets" element={<OutletManagement />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
