import Outlet from '../models/Outlet.js';
import MenuItem from '../models/MenuItem.js';

// @desc    Get all outlets
// @route   GET /api/outlets
// @access  Public
export const getOutlets = async (req, res) => {
  try {
    const outlets = await Outlet.find();
    
    res.status(200).json({
      success: true,
      count: outlets.length,
      data: outlets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single outlet
// @route   GET /api/outlets/:id
// @access  Public
export const getOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id);
    
    if (!outlet) {
      return res.status(404).json({
        success: false,
        message: 'Outlet not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: outlet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get outlet menu
// @route   GET /api/outlets/:id/menu
// @access  Public
export const getOutletMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ outletId: req.params.id });
    
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search outlets
// @route   GET /api/outlets/search
// @access  Public
export const searchOutlets = async (req, res) => {
  try {
    const { query, cuisine, location } = req.query;
    
    let searchQuery = {};
    
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (cuisine) {
      searchQuery.cuisine = { $regex: cuisine, $options: 'i' };
    }
    
    if (location) {
      searchQuery.location = { $regex: location, $options: 'i' };
    }
    
    // ... (continuing from the previous outletController.js)
    
    const outlets = await Outlet.find(searchQuery);
    
    res.status(200).json({
      success: true,
      count: outlets.length,
      data: outlets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};