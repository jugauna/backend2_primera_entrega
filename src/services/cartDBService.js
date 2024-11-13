import { cartModel } from '../dao/models/cartModel.js';
import ProductDBService from './productDBService.js';

class CartDBService {
    constructor() {
        this.productDBService = new ProductDBService();
    }

    async getAllCarts() {
        return cartModel.find();
    }

    async getCartById(cid) {
        const cart = await cartModel.findById(cid).populate('products.product');
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
        return cart;
    }

    async createCart() {
        return await cartModel.create({ products: [] });
    }

    async addProductToCart(cartId, productId) {
        const product = await this.productDBService.getProductById(productId);
        if (!product) {
            throw new Error(`El producto ${productId} no existe!`);
        }

        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error(`El carrito ${cartId} no existe!`);
        }

        cart.products.push({ product: productId, quantity: 1 });
        await cart.save();

        return cart;
    }

    async updateCart(cartId, cartData) {
        const updatedCart = await cartModel.findByIdAndUpdate(cartId, cartData, { new: true });
        if (!updatedCart) throw new Error(`El carrito ${cartId} no existe!`);
        return updatedCart;
    }
}

export default CartDBService;