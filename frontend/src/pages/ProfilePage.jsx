import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth() || { user: null, logout: () => {} };
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
      
      if (user.addresses) {
        setAddresses(user.addresses);
      }
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Check if password fields are filled
      if (profileData.newPassword || profileData.currentPassword) {
        if (!profileData.currentPassword) {
          setError('Current password is required to set a new password');
          setLoading(false);
          return;
        }
        
        if (profileData.newPassword !== profileData.confirmPassword) {
          setError('New passwords do not match');
          setLoading(false);
          return;
        }
        
        if (profileData.newPassword.length < 6) {
          setError('New password must be at least 6 characters long');
          setLoading(false);
          return;
        }
      }
      
      // Prepare data for API
      const updateData = {
        name: profileData.name,
        phone: profileData.phone
      };
      
      if (profileData.currentPassword && profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.newPassword = profileData.newPassword;
      }
      
      const response = await api.put('/users/profile', updateData);
      
      if (response && response.data && response.data.success) {
        setSuccess('Profile updated successfully');
        // Clear password fields
        setProfileData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Failed to update profile');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const response = await api.post('/users/address', newAddress);
      
      if (response && response.data && response.data.success) {
        setAddresses(response.data.addresses);
        setSuccess('Address added successfully');
        // Reset form
        setNewAddress({
          street: '',
          city: '',
          state: '',
          zipCode: '',
          isDefault: false
        });
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Failed to add address');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Address add error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await api.delete(`/users/address/${addressId}`);
      
      if (response && response.data && response.data.success) {
        setAddresses(response.data.addresses);
        setSuccess('Address deleted successfully');
      }
    } catch (err) {
      setError('Failed to delete address');
      console.error('Address delete error:', err);
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const response = await api.put(`/users/address/${addressId}/default`);
      
      if (response && response.data && response.data.success) {
        setAddresses(response.data.addresses);
        setSuccess('Default address updated');
      }
    } catch (err) {
      setError('Failed to update default address');
      console.error('Default address error:', err);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="not-logged-in">
          <h2>Please log in to view your profile</h2>
          <button onClick={() => window.location.href = '/login'}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      
      <div className="profile-tabs">
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </button>
        <button 
          className={activeTab === 'addresses' ? 'active' : ''} 
          onClick={() => setActiveTab('addresses')}
        >
          Addresses
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''} 
          onClick={() => setActiveTab('orders')}
        >
          Order History
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {activeTab === 'profile' && (
        <div className="profile-section">
          <form onSubmit={updateProfile}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email (cannot be changed)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                disabled
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <h3>Change Password</h3>
            
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={profileData.currentPassword}
                onChange={handleProfileChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={profileData.newPassword}
                onChange={handleProfileChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={profileData.confirmPassword}
                onChange={handleProfileChange}
              />
            </div>
            
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
          
          <div className="logout-section">
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'addresses' && (
        <div className="addresses-section">
          <h2>My Addresses</h2>
          
          {addresses.length === 0 ? (
            <p>You haven't added any addresses yet.</p>
          ) : (
            <div className="addresses-list">
              {addresses.map((address, index) => (
                <div key={index} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                  {address.isDefault && <span className="default-badge">Default</span>}
                  <p><strong>Street:</strong> {address.street}</p>
                  <p><strong>City:</strong> {address.city}</p>
                  <p><strong>State:</strong> {address.state}</p>
                  <p><strong>ZIP Code:</strong> {address.zipCode}</p>
                  <div className="address-actions">
                    {!address.isDefault && (
                      <button 
                        onClick={() => setDefaultAddress(address._id)}
                        className="set-default-btn"
                      >
                        Set as Default
                      </button>
                    )}
                    <button 
                      onClick={() => deleteAddress(address._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <h3>Add New Address</h3>
          <form onSubmit={addAddress} className="address-form">
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                name="street"
                value={newAddress.street}
                onChange={handleAddressChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={newAddress.state}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={newAddress.zipCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={newAddress.isDefault}
                  onChange={handleAddressChange}
                />
                Set as default address
              </label>
            </div>
            
            <button 
              type="submit" 
              className="add-button"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Address'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="orders-section">
          <h2>Order History</h2>
          <button 
            onClick={() => window.location.href = '/orders'}
            className="view-orders-btn"
          >
            View All Orders
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;