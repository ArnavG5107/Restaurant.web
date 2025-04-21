import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', protect, admin, getAllUsers);

// Get user by ID
router.get('/:id', protect, getUserById);

// Update user
router.put('/:id', protect, updateUser);

// Delete user
router.delete('/:id', protect, admin, deleteUser);

export default router;
