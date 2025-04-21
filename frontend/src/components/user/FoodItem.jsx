import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';


const FoodItem = ({ item, outletId, outletName }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity,
      outletId,
      outletName
    });
    
    // Reset quantity after adding to cart
    setQuantity(1);
    
    // Show toast notification
    alert(`Added ${quantity} ${item.name} to cart!`);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="food-item-card">
      <div className="food-item-image">
        <img src={item.image} alt={item.name} />
        {item.isVeg ? (
          <span className="veg-badge">VEG</span>
        ) : (
          <span className="non-veg-badge">NON-VEG</span>
        )}
      </div>
      
      <div className="food-item-details">
        <h3>{item.name}</h3>
        <p className="description">{item.description}</p>
        <div className="price-rating">
          <span className="price">₹{item.price}</span>
          {item.rating && <span className="rating">★ {item.rating}</span>}
        </div>
        
        <div className="quantity-control">
          <button 
            className="quantity-btn" 
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="quantity">{quantity}</span>
          <button 
            className="quantity-btn" 
            onClick={incrementQuantity}
          >
            +
          </button>
        </div>
        
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodItem;
