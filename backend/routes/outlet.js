import express from 'express';
import { 
  getOutlets, 
  getOutlet, 
  getOutletMenu, 
  searchOutlets 
} from '../controllers/outletController.js';

const router = express.Router();

router.get('/', getOutlets);
router.get('/search', searchOutlets);
router.get('/:id', getOutlet);
router.get('/:id/menu', getOutletMenu);

export default router;
