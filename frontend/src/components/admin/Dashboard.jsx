import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeOutlets: 0,
    popularItems: []
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/admin/dashboard-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Active Outlets</h3>
          <p className="stat-value">{stats.activeOutlets}</p>
        </div>
      </div>

      <div className="popular-items">
        <h2>Popular Items</h2>
        <ul>
          {stats.popularItems.map(item => (
            <li key={item._id}>
              <span className="item-name">{item.name}</span>
              <span className="item-orders">{item.orderCount} orders</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
