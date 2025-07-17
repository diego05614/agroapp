import { Router } from 'express';
import { registerSale, listSales, getProductList } from '../controllers/saleController';

const router = Router();

router.post('/', registerSale);
router.get('/', listSales);
router.get('/products', getProductList);

export default router;