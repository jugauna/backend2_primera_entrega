import CartDBService from './cartDBService.js';
import ProductDBService from './productDBService.js';

const productDBService = new ProductDBService();
const cartDBService = new CartDBService(productDBService);

export async function getProductsFromCart(req, res, next) {
    try {
        const { cid } = req.params;
        const cart = await cartDBService.getProductsFromCartByID(cid);
        res.status(200).json(cart);
    } catch (err) {
        next(err); // Pasa el error al middleware de manejo de errores
    }
}

export async function createCart(req, res, next) {
    try {
        const newCart = await cartDBService.createCart();
        res.status(201).json(newCart);
    } catch (err) {
        next(err); // Pasa el error al middleware de manejo de errores
    }
}

export async function addProductToCart(req, res, next) {
    try {
        const cartId = req.params.cartId;
        const cart = await Cart.findById(cartId);

        if (!cart) {
            throw new Error(`El carrito ${cartId} no existe!`);
        }

        // Resto de la lógica para agregar el producto al carrito
        // ...

        res.status(200).json(cart);
    } catch (err) {
        next(err); // Pasa el error al middleware de manejo de errores
    }
}