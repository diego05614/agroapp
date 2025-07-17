import { Router } from 'express';
import { registerExpense, listExpenses, getUniqueDescriptions } from '../controllers/expenseController';

const router = Router();

router.post('/', registerExpense);
router.get('/', listExpenses);
router.get('/descriptions', getUniqueDescriptions);

export default router;