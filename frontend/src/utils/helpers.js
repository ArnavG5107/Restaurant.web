// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  export const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get order status text and color
  export const getOrderStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Pending', color: '#f57c00' };
      case 'preparing':
        return { text: 'Preparing', color: '#1976d2' };
      case 'ready':
        return { text: 'Ready for Pickup', color: '#388e3c' };
      case 'delivered':
        return { text: 'Delivered', color: '#00796b' };
      case 'cancelled':
        return { text: 'Cancelled', color: '#c62828' };
      default:
        return { text: status, color: '#666' };
    }
  };
  
  // Truncate text with ellipsis
  export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };
  
  // Validate email format
  export const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  // Validate phone number format (10 digits)
  export const isValidPhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(String(phone));
  };
  
  // Get browser location
  export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          () => {
            reject(new Error('Unable to retrieve your location'));
          }
        );
      }
    });
  };
  