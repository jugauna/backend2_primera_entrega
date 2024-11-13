import { cartModel } from '../dao/models/cartModel.js';
import CartDAO from '../dao/CartDAO.js';

class CartRepository  {
    constructor() {
        super();
        this.cartDAO = new CartDAO();
    }

    async getAllCarts() {
        return this.cartDAO.getAllCarts();
    }

    async getProductsFromCartByID(cartId) {
        return this.cartDAO.getProductsFromCartByID(cartId);
    }

    async createCart() {
        return this.cartDAO.createCart();
    }

    async addProductToCart(cartId, productId) {
        return this.cartDAO.addProductToCart(cartId, productId);
    }

    async updateOne(query, update) {
        return this.cartDAO.updateOne(query, update);
    }

    async findOne(query) {
        return this.cartDAO.findOne(query);
    }
}

export default CartRepository;