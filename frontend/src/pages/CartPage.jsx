import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';


const CartPage = () => {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const success = await login(loginForm);
      if (!success) {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleCheckout = async () => {
    if (!user) {
      setIsCheckingOut(true);
      return;
    }
    
    if (!address) {
      alert('Please enter your delivery address');
      return;
    }
    
    try {
      const orderData = {
        items: cart.map(item => ({
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          outletId: item.outletId
        })),
        totalAmount: total,
        deliveryAddress: address,
        paymentMethod
      };
      
      const response = await api.post('/orders', orderData);
      
      if (response.data._id) {
        clearCart();
        navigate(`/orders?new=${response.data._id}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    }
  };
  
  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some delicious items to your cart and come back!</p>
        <button onClick={() => navigate('/')}>Browse Outlets</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>From: {item.outletName}</p>
                <p>Price: ₹{item.price}</p>
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div className="item-total">
                <p>₹{item.price * item.quantity}</p>
                <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{total}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee:</span>
            <span>₹50</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{total + 50}</span>
          </div>
          
          {user ? (
            <>
              <div className="address-input">
                <label htmlFor="address">Delivery Address:</label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full delivery address"
                  required
                />
              </div>
              
              <div className="payment-method">
                <label>Payment Method:</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="cod">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              
              <button onClick={handleCheckout} className="checkout-btn">
                Place Order
              </button>
            </>
          ) : (
            <button onClick={() => setIsCheckingOut(true)} className="checkout-btn">
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>
      
      {isCheckingOut && !user && (
        <div className="login-overlay">
          <div className="login-modal">
            <h2>Login to Continue</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="Email"
                required
              />
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="Password"
                required
              />
              <button type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <button onClick={() => setIsCheckingOut(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

