import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect); // Apply protection to all lead routes

router.route('/').get(getLeads).post(createLead);
router.route('/export/csv').get(exportLeadsCSV);
router.route('/:id').get(getLeadById).put(updateLead).delete(deleteLead);

export default router;
