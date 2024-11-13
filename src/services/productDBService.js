import ProductDAO from '../dao/ProductDAO.js';

class ProductDBService {
    async getAllProducts(query) {
        return await ProductDAO.getAll(query);
    }

    async getProductById(id) {
        return await ProductDAO.getById(id);
    }

    async createProduct(productData) {
        return await ProductDAO.create(productData);
    }

    async updateProduct(id, updateData) {
        return await ProductDAO.update(id, updateData);
    }

    async deleteProduct(id) {
        return await ProductDAO.delete(id);
    }
}

export default ProductDBService;