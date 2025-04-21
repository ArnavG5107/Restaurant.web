import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import FoodItem from '../components/user/FoodItem';
import Loader from '../components/common/Loader';


const OutletPage = () => {
  const { id } = useParams();
  const [outlet, setOutlet] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOutletDetails = async () => {
      try {
        const outletResponse = await api.get(`/outlets/${id}`);
        setOutlet(outletResponse.data);
        
        const menuResponse = await api.get(`/outlets/${id}/menu`);
        setMenu(menuResponse.data);
      } catch (error) {
        console.error('Error fetching outlet details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutletDetails();
  }, [id]);

  if (loading) return <Loader />;
  if (!outlet) return <div className="error-message">Outlet not found</div>;

  // Extract unique categories from menu
  const categories = ['all', ...new Set(menu.map(item => item.category))];
  
  // Filter menu items based on active category and search term
  const filteredMenu = menu.filter(item => 
    (activeCategory === 'all' || item.category === activeCategory) &&
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="outlet-page">
      <div className="outlet-header">
        <div className="outlet-banner" style={{ backgroundImage: `url(${outlet.bannerImage || outlet.image})` }}>
          <div className="outlet-overlay">
            <div className="outlet-info">
              <h1>{outlet.name}</h1>
              <p className="cuisine">{outlet.cuisine}</p>
              <p className="location">{outlet.location}</p>
              <div className="outlet-meta">
                <span className="rating">★ {outlet.rating}</span>
                <span className="delivery-time">{outlet.deliveryTime} min</span>
                {outlet.isOpen ? (
                  <span className="open-status open">Open Now</span>
                ) : (
                  <span className="open-status closed">Closed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-container">
        <div className="menu-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="menu-items">
          {filteredMenu.length > 0 ? (
            filteredMenu.map(item => (
              <FoodItem 
                key={item._id} 
                item={item} 
                outletId={outlet._id}
                outletName={outlet.name}
              />
            ))
          ) : (
            <div className="no-items-message">
              No menu items found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutletPage;
