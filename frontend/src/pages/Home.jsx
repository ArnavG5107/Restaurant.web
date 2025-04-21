import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OutletList from '../components/user/OutletList';
import { api } from '../utils/api';
import Loader from '../components/common/Loader';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [outlets, setOutlets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Extract search query from URL if present
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    if (query) {
      setSearchQuery(query);
    }
    
    fetchOutlets(query);
  }, [location.search]);

  const fetchOutlets = async (query = '') => {
    setLoading(true);
    try {
      const endpoint = query 
        ? `/outlets/search?query=${encodeURIComponent(query)}` 
        : '/outlets';
      
      const response = await api.get(endpoint);
      setOutlets(response.data.data);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Delicious Food Delivered to Your Doorstep</h1>
          <p>Order from your favorite restaurants with just a few clicks</p>
          <div className="hero-search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for restaurants or cuisines..."
            />
            <button onClick={() => fetchOutlets(searchQuery)}>Search</button>
          </div>
        </div>
      </div>
      
      <div className="outlets-section">
        <h2>Available Restaurants</h2>
        {loading ? <Loader /> : <OutletList outlets={outlets} />}
      </div>
    </div>
  );
};

export default Home;
