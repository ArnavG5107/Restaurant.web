import Order from '../models/Order.js';
import User from '../models/User.js';
import Outlet from '../models/Outlet.js';
import MenuItem from '../models/MenuItem.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const activeOutlets = await Outlet.countDocuments({ isOpen: true });
    const popularItems = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.itemId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'menuitems', localField: '_id', foreignField: '_id', as: 'itemDetails' } },
      { $unwind: "$itemDetails" },
      { $project: { _id: 1, name: "$itemDetails.name", count: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeOutlets,
        popularItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all orders (with filters)
// @route   GET /api/admin/orders
// @access  Private (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new outlet
// @route   POST /api/admin/outlets
// @access  Private (Admin only)
export const createOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.create(req.body);

    res.status(201).json({
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

// @desc    Update outlet
// @route   PUT /api/admin/outlets/:id
// @access  Private (Admin only)
export const updateOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

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

// @desc    Delete outlet
// @route   DELETE /api/admin/outlets/:id
// @access  Private (Admin only)
export const deleteOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id);

    if (!outlet) {
      return res.status(404).json({
        success: false,
        message: 'Outlet not found'
      });
    }

    await outlet.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add menu item
// @route   POST /api/admin/outlets/:id/menu
// @access  Private (Admin only)
export const addMenuItem = async (req, res) => {
  try {
    req.body.outletId = req.params.id;
    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
export const getAnalytics = async (req, res) => {
    try {
      const { timeRange } = req.query;
      let dateFilter = {};
      const now = new Date();
      
      // Set date filter based on timeRange
      if (timeRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { $gte: weekAgo } };
      } else if (timeRange === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { $gte: monthAgo } };
      } else if (timeRange === 'year') {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { $gte: yearAgo } };
      }
      
      // Get sales data grouped by date
      const salesData = await Order.aggregate([
        { $match: { ...dateFilter, status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            amount: { $sum: "$totalAmount" }
          }
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", amount: 1 } }
      ]);
      
      // Get order status distribution
      const orderStatusCount = await Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $project: { _id: 0, status: "$_id", count: 1 } }
      ]).then(results => {
        return results.reduce((acc, curr) => {
          acc[curr.status] = curr.count;
          return acc;
        }, {});
      });
      
      // Get top selling items
      const topItems = await Order.aggregate([
        { $match: { ...dateFilter, status: { $ne: 'cancelled' } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.itemId",
            name: { $first: "$items.name" },
            count: { $sum: "$items.quantity" }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, name: 1, count: 1 } }
      ]);
      
      res.status(200).json({
        success: true,
        salesData,
        orderStatusCount,
        topItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };
  

// @desc    Update menu item
// @route   PUT /api/admin/outlets/:outletId/menu/:itemId
// @access  Private (Admin only)
export const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: req.params.itemId, outletId: req.params.outletId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/admin/outlets/:outletId/menu/:itemId
// @access  Private (Admin only)
export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findOneAndDelete({
      _id: req.params.itemId,
      outletId: req.params.outletId
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};