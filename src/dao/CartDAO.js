import { cartModel } from './models/cartModel.js';

class CartDAO {
    async createCart() {
        return cartModel.create({ products: [] });
    }

    async findOne(query) {
        return cartModel.findOne(query).populate('products.product');
    }

    async updateOne(query, update) {
        return cartModel.updateOne(query, update);
    }
}

export default new CartDAO();

