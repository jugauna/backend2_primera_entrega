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

//passport.authenticate("current", {session:false}),
router.get('/products', passport.authenticate("current", {session:false}), async (req, res) => {
    console.log(req.user);  // Esto debería mostrar los datos del usuario autenticado en la consola
    let usuario = req.user;
    const products = await ProductService.getAllProducts(req.query);
    if (!products || !products.docs) {
        return res.render('notFound', {
            usuario, isLogin: req.user,
            title: 'Not Found',
            style: 'index.css'
        });
    }
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
    );
});

router.get('/realtimeproducts', passport.authenticate("current", {session:false}), async (req, res) => {
    console.log(req.user);  // Esto debería mostrar los datos del usuario autenticado en la consola
    let usuario = req.user;
    const products = await ProductService.getAllProducts(req.query);
    if (!products || !products.docs) {
        return res.render('notFound', {
            usuario, isLogin: req.user,
            title: 'Not Found',
            style: 'index.css'
        });
    }
    res.render(
        'realTimeProducts',
        {
            usuario, isLogin: req.user,
            title: 'Productos',
            style: 'index.css',
            products: JSON.parse(JSON.stringify(products.docs))
        }
    );
});

export default router;