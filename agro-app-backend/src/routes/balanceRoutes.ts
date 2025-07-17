import { Router } from 'express';
import { getBalance } from '../controllers/balanceController';

const router = Router();

router.get('/', getBalance);

export default router;