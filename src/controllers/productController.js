import productDBService from '../services/productDBService.js';

const getAllProducts = async (req, res) => {
    try {
        const products = await productDBService.getAllProducts(req.query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productDBService.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: `Producto con id ${pid} no encontrado` });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    const { title, description, price, category, stock } = req.body;
    try {
        const newProduct = await productDBService.createProduct({ title, description, price, category, stock });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    const { pid } = req.params;
    const updateData = req.body;
    try {
        const updatedProduct = await productDBService.updateProduct(pid, updateData);
        if (!updatedProduct) {
            return res.status(404).json({ error: `Producto con id ${pid} no encontrado` });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await productDBService.deleteProduct(pid);
        if (!deletedProduct) {
            return res.status(404).json({ error: `Producto con id ${pid} no encontrado` });
        }
        res.status(200).json({ message: `Producto con id ${pid} eliminado` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};