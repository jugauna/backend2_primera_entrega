import { Router } from 'express';
import productController from '../controllers/productController.js';
//import { auth } from '../middleware/auth.js';
import passport from 'passport';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/:pid', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:pid', productController.updateProduct);
router.delete('/:pid', productController.deleteProduct);

export default router;