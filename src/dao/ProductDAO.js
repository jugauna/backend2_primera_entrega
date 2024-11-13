import { productModel } from './models/productModel.js';

class ProductDAO {
    async getAll(query) {
        return await productModel.paginate(query, { limit: 10, page: 1 });
    }

    async getById(id) {
        return await productModel.findById(id);
    }

    async create(productData) {
        return await productModel.create(productData);
    }

    async update(id, updateData) {
        return await productModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await productModel.findByIdAndDelete(id);
    }
}

export default new ProductDAO();

