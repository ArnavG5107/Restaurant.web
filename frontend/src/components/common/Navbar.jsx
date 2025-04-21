import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/assets/logo.png" alt="Food Ordering" />
            <span>FoodExpress</span>
          </Link>
        </div>
        
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
        
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
        
        <ul className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              {isAdmin ? (
                <li>
                  <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                      <i className="fas fa-shopping-cart"></i>
                      {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                    </Link>
                  </li>
                </>
              )}
              <li className="dropdown">
                <button className="dropdown-toggle">
                  <i className="fas fa-user"></i> {user.name.split(' ')[0]}
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}>
                    Logout
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="register-btn" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
