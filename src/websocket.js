import ProductDBService from './services/productDBService.js';

const productService = new ProductDBService();

export default (io) => {
    io.on("connection", (socket) => {
        socket.on("createProduct", async (data) => {
            try {
                await productService.createProduct(data);
                const products = await productService.getAllProducts({});
                socket.emit("publishProducts", products.docs);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });
        socket.on("deleteProduct", async (data) => {
            try {
                const result = await productService.deleteProduct(data.pid);
                const products = await productService.getAllProducts({});
                socket.emit("publishProducts", products.docs);
            } catch (error) {
                socket.emit("statusError", error.message);
            }
        });
    });
}