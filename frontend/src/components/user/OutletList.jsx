import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import Loader from '../common/Loader';

const OutletList = () => {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOutlets, setFilteredOutlets] = useState([]);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await api.get('/outlets');
        setOutlets(response.data);
        setFilteredOutlets(response.data);
      } catch (error) {
        console.error('Error fetching outlets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutlets();
  }, []);

  useEffect(() => {
    const results = outlets.filter(outlet =>
      outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outlet.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outlet.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOutlets(results);
  }, [searchTerm, outlets]);

  if (loading) return <Loader />;

  return (
    <div className="outlet-list-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search outlets by name, cuisine, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="outlets-grid">
        {filteredOutlets.length > 0 ? (
          filteredOutlets.map(outlet => (
            <Link to={`/outlet/${outlet._id}`} key={outlet._id} className="outlet-card">
              <div className="outlet-image">
                <img src={outlet.image} alt={outlet.name} />
              </div>
              <div className="outlet-info">
                <h3>{outlet.name}</h3>
                <p className="cuisine">{outlet.cuisine}</p>
                <p className="location">{outlet.location}</p>
                <div className="outlet-footer">
                  <span className="rating">★ {outlet.rating}</span>
                  <span className="delivery-time">{outlet.deliveryTime} min</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">No outlets found matching your search.</div>
        )}
      </div>
    </div>
  );
};

export default OutletList;
