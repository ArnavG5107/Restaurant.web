import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>FoodExpress</h3>
          <p>Order your favorite food from the best restaurants in your area.</p>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p><i className="fas fa-map-marker-alt"></i> 123 Food Street, Foodville</p>
          <p><i className="fas fa-phone"></i> +1 234 567 8900</p>
          <p><i className="fas fa-envelope"></i> support@foodexpress.com</p>
        </div>
        
        <div className="footer-section">
          <h3>Download Our App</h3>
          <p>Get the best food ordering experience on our mobile app.</p>
          <div className="app-links">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="/assets/app-store.png" alt="App Store" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="/assets/google-play.png" alt="Google Play" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FoodExpress. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
