import express from 'express';
import { validateCreateOrder, validate } from '../middleware/validator.js';
import { protect } from '../middleware/auth.js'; // Assuming this is where protect comes from
import { createOrder } from '../controllers/orderController.js'; // Assuming this is where createOrder comes from

const router = express.Router();

router.post('/', protect, validateCreateOrder, validate, createOrder);

export default router;