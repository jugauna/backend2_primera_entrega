import { Router } from 'express';
import ProductDBService from '../services/productDBService.js';
import CartDBService from '../services/cartDBService.js';
//import { auth } from '../middleware/auth.js';
import TicketService from '../services/TicketService.js';
import passport from 'passport';

const router = Router();
const productService = new ProductDBService(); // Crear una instancia de ProductDBService
const cartService = new CartDBService(productService); // Crear una instancia de CartDBService
const ticketService = new TicketService();

router.get('/tickets', async (req, res, next) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.render('tickets', { tickets });
    } catch (err) {
        next(err);
    }
});

router.get('/tickets/create', (req, res) => {
    res.render('createTicket');
});

//passport.authenticate("current", {session:false}),
router.get('/products', passport.authenticate("current", {session:false}), async (req, res) => {
    console.log(req.user);  // Esto debería mostrar los datos del usuario autenticado en la consola
    let usuario = req.user;
    const products = await productService.getAllProducts(req.query);
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
    const products = await productService.getAllProducts(req.query);
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
router.get('/cart/:cid', passport.authenticate("current", {session:false}), async (req, res) => {
    let usuario = req.user;
    const response = await cartService.getCartById(req.params.cid);
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
