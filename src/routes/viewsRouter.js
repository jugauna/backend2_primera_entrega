import { Router } from 'express';
import { productDBService } from '../services/productDBService.js';
import { cartDBService } from '../services/cartDBService.js';
import { auth } from '../middleware/auth.js';

const router = Router();
const ProductService = new productDBService();
const CartService = new cartDBService(ProductService);

router.get('/products', auth, async (req, res) => {

    console.log(req.user);  // Esto debería mostrar los datos del usuario autenticado en la consola

    let usuario=req.user
    const products = await ProductService.getAllProducts(req.query);

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
    
    const products = await ProductService.getAllProducts(req.query);
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

router.get('/cart/:cid', async (req, res) => {
    const response = await CartService.getProductsFromCartByID(req.params.cid);

    if (response.status === 'error') {
        return res.render(
            'notFound',
            {
                title: 'Not Found',
                style: 'index.css'
            }
        );
    }

    res.render(
        'cart',
        {
            title: 'Carrito',
            style: 'index.css',
            products: JSON.parse(JSON.stringify(response.products))
        }
    )
});

export default router;