import { validateCreateOutlet, validateCreateMenuItem, validate } from '../middleware/validator.js';
import { Router } from 'express';
import { createOutlet, addMenuItem, getDashboardStats } from '../controllers/adminController.js'; // Adjust the path if needed

const router = Router();

router.post('/outlets', validateCreateOutlet, validate, createOutlet);
router.post('/outlets/:id/menu', validateCreateMenuItem, validate, addMenuItem);
router.get('/analytics', getDashboardStats);

export default router;
