import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const OutletManagement = () => {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    location: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    image: '',
    bannerImage: '',
    deliveryTime: '',
    isOpen: true
  });

  useEffect(() => {
    fetchOutlets();
  }, []);

  const fetchOutlets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/outlets');
      setOutlets(response.data);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cuisine: '',
      location: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      image: '',
      bannerImage: '',
      deliveryTime: '',
      isOpen: true
    });
    setFormMode('add');
    setSelectedOutlet(null);
  };

  const handleEditOutlet = (outlet) => {
    setFormData({
      name: outlet.name,
      description: outlet.description,
      cuisine: outlet.cuisine,
      location: outlet.location,
      address: outlet.address || {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      image: outlet.image,
      bannerImage: outlet.bannerImage || '',
      deliveryTime: outlet.deliveryTime,
      isOpen: outlet.isOpen
    });
    setSelectedOutlet(outlet._id);
    setFormMode('edit');
  };

  const handleDeleteOutlet = async (outletId) => {
    if (!window.confirm('Are you sure you want to delete this outlet?')) {
      return;
    }
    
    try {
      await api.delete(`/admin/outlets/${outletId}`);
      fetchOutlets();
      resetForm();
    } catch (error) {
      console.error('Error deleting outlet:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formMode === 'add') {
        await api.post('/admin/outlets', formData);
      } else {
        await api.put(`/admin/outlets/${selectedOutlet}`, formData);
      }
      
      fetchOutlets();
      resetForm();
    } catch (error) {
      console.error('Error saving outlet:', error);
    }
  };

  if (loading && outlets.length === 0) {
    return <div>Loading outlets...</div>;
  }

  return (
    <div className="outlet-management">
      <h1>Outlet Management</h1>
      
      <div className="outlet-management-container">
        <div className="outlet-form-container">
          <h2>{formMode === 'add' ? 'Add New Outlet' : 'Edit Outlet'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Outlet Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cuisine">Cuisine</label>
                <input
                  type="text"
                  id="cuisine"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address.street">Street Address</label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.city">City</label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address.state">State</label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address.zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="address.zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bannerImage">Banner Image URL (Optional)</label>
              <input
                type="text"
                id="bannerImage"
                name="bannerImage"
                value={formData.bannerImage}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deliveryTime">Delivery Time (minutes)</label>
                <input
                  type="number"
                  id="deliveryTime"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="isOpen"
                    checked={formData.isOpen}
                    onChange={handleInputChange}
                  />
                  Outlet is Open
                </label>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-btn">
                {formMode === 'add' ? 'Add Outlet' : 'Update Outlet'}
              </button>
              {formMode === 'edit' && (
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="outlets-list">
          <h2>Existing Outlets</h2>
          {outlets.length === 0 ? (
            <p>No outlets found. Add your first outlet!</p>
          ) : (
            <div className="outlets-grid">
              {outlets.map(outlet => (
                <div key={outlet._id} className="outlet-card">
                  <div className="outlet-image">
                    <img src={outlet.image} alt={outlet.name} />
                    {!outlet.isOpen && <div className="closed-badge">Closed</div>}
                  </div>
                  <div className="outlet-info">
                    <h3>{outlet.name}</h3>
                    <p className="cuisine">{outlet.cuisine}</p>
                    <p className="location">{outlet.location}</p>
                  </div>
                  <div className="outlet-actions">
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEditOutlet(outlet)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteOutlet(outlet._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutletManagement;
