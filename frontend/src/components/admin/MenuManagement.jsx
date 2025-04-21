import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const MenuManagement = () => {
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVeg: false,
    image: ''
  });

  useEffect(() => {
    fetchOutlets();
  }, []);

  useEffect(() => {
    if (selectedOutlet) {
      fetchMenuItems(selectedOutlet);
    }
  }, [selectedOutlet]);

  const fetchOutlets = async () => {
    try {
      const response = await api.get('/admin/outlets');
      setOutlets(response.data);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    }
  };

  const fetchMenuItems = async (outletId) => {
    try {
      const response = await api.get(`/admin/outlets/${outletId}/menu`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/outlets/${selectedOutlet}/menu`, newItem);
      fetchMenuItems(selectedOutlet);
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: '',
        isVeg: false,
        image: ''
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(`/admin/outlets/${selectedOutlet}/menu/${itemId}`);
      fetchMenuItems(selectedOutlet);
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <div className="menu-management">
      <h1>Menu Management</h1>

      <select 
        value={selectedOutlet} 
        onChange={(e) => setSelectedOutlet(e.target.value)}
      >
        <option value="">Select an outlet</option>
        {outlets.map(outlet => (
          <option key={outlet._id} value={outlet._id}>{outlet.name}</option>
        ))}
      </select>

      {selectedOutlet && (
        <>
          <h2>Add New Menu Item</h2>
          <form onSubmit={handleAddItem}>
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              placeholder="Item Name"
              required
            />
            <textarea
              name="description"
              value={newItem.description}
              onChange={handleInputChange}
              placeholder="Description"
              required
            />
            <input
              type="number"
              name="price"
              value={newItem.price}
              onChange={handleInputChange}
              placeholder="Price"
              required
            />
            <input
              type="text"
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
              placeholder="Category"
              required
            />
            <label>
              <input
                type="checkbox"
                name="isVeg"
                checked={newItem.isVeg}
                onChange={handleInputChange}
              />
              Vegetarian
            </label>
            <input
              type="text"
              name="image"
              value={newItem.image}
              onChange={handleInputChange}
              placeholder="Image URL"
              required
            />
            <button type="submit">Add Item</button>
          </form>

          <h2>Current Menu Items</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Vegetarian</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>₹{item.price}</td>
                  <td>{item.category}</td>
                  <td>{item.isVeg ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default MenuManagement;
