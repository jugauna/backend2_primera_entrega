import ProductDAO from '../dao/ProductDAO.js';

class ProductRepository  {
    constructor() {
        super();
        this.productDAO = ProductDAO;
    }

    async getProductByID(pid) {
        return this.productDAO.getById(pid);
    }

    async createProduct(product) {
        return this.productDAO.create(product);
    }

    async deleteProduct(pid) {
        return this.productDAO.delete(pid);
    }

    async getAllProducts(paginateOptions) {
        return this.productDAO.getAll(paginateOptions);
    }

    async updateProduct(pid, productUpdate) {
        return this.productDAO.update(pid, productUpdate);
    }
}

export default ProductRepository;