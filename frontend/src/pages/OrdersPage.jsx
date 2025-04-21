import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const { user } = useAuth();
  const location = useLocation();

  // Check if there's a new order ID in the URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newOrderId = params.get('new');
    if (newOrderId) {
      setActiveOrder(newOrderId);
    }
  }, [location]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.data);
        
        // If no active order is set but we have orders, set the first one as active
        if (!activeOrder && response.data.data.length > 0) {
          setActiveOrder(response.data.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, activeOrder]);

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="orders-page empty-orders">
        <h1>My Orders</h1>
        <div className="empty-state">
          <img src="/assets/empty-orders.svg" alt="No orders" />
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet. Start ordering delicious food!</p>
          <button onClick={() => window.location.href = '/'}>Browse Restaurants</button>
        </div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'preparing': return 'status-preparing';
      case 'ready': return 'status-ready';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Find the active order details
  const selectedOrder = orders.find(order => order._id === activeOrder);

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      
      <div className="orders-container">
        <div className="orders-list">
          {orders.map(order => (
            <div 
              key={order._id} 
              className={`order-card ${order._id === activeOrder ? 'active' : ''}`}
              onClick={() => setActiveOrder(order._id)}
            >
              <div className="order-header">
                <span className="order-id">Order #{order._id.slice(-6)}</span>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="order-info">
                <p className="order-date">{formatDate(order.createdAt)}</p>
                <p className="order-items">{order.items.length} items</p>
                <p className="order-total">₹{order.totalAmount}</p>
              </div>
            </div>
          ))}
        </div>
        
        {selectedOrder && (
          <div className="order-details">
            <div className="order-details-header">
              <h2>Order #{selectedOrder._id.slice(-6)}</h2>
              <span className={`order-status ${getStatusClass(selectedOrder.status)}`}>
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </span>
            </div>
            
            <div className="order-progress">
              <div className="progress-track">
                <div 
                  className="progress-fill"
                  style={{ width: `${(getStatusStep(selectedOrder.status) / 4) * 100}%` }}
                ></div>
              </div>
              <div className="progress-steps">
                <div className={`step ${getStatusStep(selectedOrder.status) >= 1 ? 'active' : ''}`}>
                  <div className="step-icon">1</div>
                  <div className="step-label">Order Placed</div>
                </div>
                <div className={`step ${getStatusStep(selectedOrder.status) >= 2 ? 'active' : ''}`}>
                  <div className="step-icon">2</div>
                  <div className="step-label">Preparing</div>
                </div>
                <div className={`step ${getStatusStep(selectedOrder.status) >= 3 ? 'active' : ''}`}>
                  <div className="step-icon">3</div>
                  <div className="step-label">Ready for Pickup</div>
                </div>
                <div className={`step ${getStatusStep(selectedOrder.status) >= 4 ? 'active' : ''}`}>
                  <div className="step-icon">4</div>
                  <div className="step-label">Delivered</div>
                </div>
              </div>
            </div>
            
            <div className="order-items-list">
              <h3>Order Items</h3>
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>
            
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.totalAmount - 50}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee:</span>
                <span>₹50</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
            
            <div className="delivery-info">
              <h3>Delivery Information</h3>
              <p><strong>Address:</strong> {selectedOrder.deliveryAddress}</p>
              <p><strong>Payment Method:</strong> {
                selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' :
                selectedOrder.paymentMethod === 'card' ? 'Credit/Debit Card' :
                'UPI'
              }</p>
              <p><strong>Payment Status:</strong> {
                selectedOrder.paymentStatus.charAt(0).toUpperCase() + 
                selectedOrder.paymentStatus.slice(1)
              }</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
