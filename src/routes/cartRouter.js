import { Router } from 'express';
import { addProductToCart, createCart, getCartById, purchaseCart } from '../controllers/cartController.js';
import CartDBService from '../services/cartDBService.js';
//import { auth } from '../middleware/auth.js';
import passport from 'passport';

const router = Router();

//passport.authenticate("current", {session:false}),
router.post('/', passport.authenticate("current", {session:false}), createCart);
router.get('/:cid', passport.authenticate("current", {session:false}), getCartById);
router.post("/:cid/product/:pid", passport.authenticate("current", {session:false}), addProductToCart);
router.post("/:cid/purchase", passport.authenticate("current", {session:false}), purchaseCart);

export default router;