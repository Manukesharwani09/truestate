/**
 * Sales Routes
 */

import { Router } from 'express';
import { SalesController } from '../controllers/sales.controller';

const router = Router();

// GET /api/sales - Get sales with filters
router.post('/sales', SalesController.getSales);

// GET /api/sales/filters - Get filter options
router.get('/sales/filters', SalesController.getFilterOptions);

// POST /api/sales/stats - Get statistics with filters
router.post('/sales/stats', SalesController.getStats);

export default router;
