import { Router } from 'express';
import productDBService from '../services/productDBService.js';
import cartDBService from '../services/cartDBService.js';
import { auth } from '../middleware/auth.js';

const router = Router();
const productService = new productDBService();
const cartService = new cartDBService(productService);

router.get('/products', auth, async (req, res) => {
    console.log(req.user);  // Esto debería mostrar los datos del usuario autenticado en la consola
    let usuario=req.user
    const products = await productService.getAllProducts(req.query);
    res.render(
        'index',
        {
            usuario, isLogin: req.user,
            title: 'Productos',
            style: 'index.css',
            products: JSON.parse(JSON.stringify(products.docs)),
            prevLink: {
                exist: products.prevLink ? true : false,
                link: products.prevLink
            },
            nextLink: {
                exist: products.nextLink ? true : false,
                link: products.nextLink
            }
            
        }
    )
});

router.get('/realtimeproducts', auth, async (req, res) => {
    console.log(req.user);  // Esto debería mostrar los datos del usuario autenticado en la consola
    let usuario=req.user    
    const products = await productService.getAllProducts(req.query);
    res.render(
        'realTimeProducts',
        {
            usuario, isLogin: req.user,
            title: 'Productos',
            style: 'index.css',
            products: JSON.parse(JSON.stringify(products.docs))
        }
    )
});

router.get('/cart/:cid', auth, async (req, res) => {
    let usuario=req.user
    const response = await cartService.getProductsFromCartByID(req.params.cid);
    if (response.status === 'error') {
        return res.render(
            'notFound',
            {
                usuario, isLogin: req.user,
                title: 'Not Found',
                style: 'index.css'
            }
        );
    }
    res.render(
        'cart',
        {
            usuario, isLogin: req.user,
            title: 'Carrito',
            style: 'index.css',
            products: JSON.parse(JSON.stringify(response.products))
        }
    )
});

export default router;