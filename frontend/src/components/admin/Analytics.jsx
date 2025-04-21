import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Analytics.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: []
  });
  const [orderStatusData, setOrderStatusData] = useState({
    labels: [],
    datasets: []
  });
  const [topItemsData, setTopItemsData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/analytics?timeRange=${timeRange}`);
      const data = response.data;
      
      // Format sales data for line chart
      setSalesData({
        labels: data.salesData.map(item => item.date),
        datasets: [{
          label: 'Sales Revenue',
          data: data.salesData.map(item => item.amount),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1
        }]
      });
      
      // Format order status data for pie chart
      setOrderStatusData({
        labels: Object.keys(data.orderStatusCount).map(status => 
          status.charAt(0).toUpperCase() + status.slice(1)
        ),
        datasets: [{
          data: Object.values(data.orderStatusCount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderWidth: 1
        }]
      });
      
      // Format top items data for bar chart
      setTopItemsData({
        labels: data.topItems.map(item => item.name),
        datasets: [{
          label: 'Orders',
          data: data.topItems.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Analytics',
      },
    },
  };

  if (loading) {
    return <div className="loading">Loading analytics data...</div>;
  }

  return (
    <div className="analytics">
      <h1>Analytics Dashboard</h1>
      
      <div className="time-range-selector">
        <button 
          className={timeRange === 'week' ? 'active' : ''} 
          onClick={() => setTimeRange('week')}
        >
          Last Week
        </button>
        <button 
          className={timeRange === 'month' ? 'active' : ''} 
          onClick={() => setTimeRange('month')}
        >
          Last Month
        </button>
        <button 
          className={timeRange === 'year' ? 'active' : ''} 
          onClick={() => setTimeRange('year')}
        >
          Last Year
        </button>
      </div>
      
      <div className="charts-container">
        <div className="chart-card">
          <h2>Sales Trend</h2>
          <div className="chart-container">
            <Line data={salesData} options={chartOptions} />
          </div>
        </div>
        
        <div className="chart-row">
          <div className="chart-card">
            <h2>Order Status Distribution</h2>
            <div className="chart-container">
              <Pie 
                data={orderStatusData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    }
                  }
                }} 
              />
            </div>
          </div>
          
          <div className="chart-card">
            <h2>Top Selling Items</h2>
            <div className="chart-container">
              <Bar 
                data={topItemsData} 
                options={{
                  responsive: true,
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
