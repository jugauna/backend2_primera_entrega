import { isValidObjectId } from 'mongoose';
import CartDBService from '../services/cartDBService.js';
import ProductDBService from '../services/productDBService.js';

const cartDBService = new CartDBService();
const productDBService = new ProductDBService();

export const createCart = async (req, res) => {
    try {
        const newCart = await cartDBService.createCart();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getCartById = async (req, res) => {
    try {
        const cart = await cartDBService.getCartById(req.params.cid);
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addProductToCart = async (req, res) => {
    let { cid, pid } = req.params;
    if (!cid || !pid) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Complete pid / cid` });
    }
    console.log('Cart ID:', cid);
    console.log('User ID:', req.user ? req.user._id : 'undefined');
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Formato inválido cid / pid` });
    }
    try {
        let product = await productDBService.getProductById(pid);
        console.log('Producto encontrado:', product);
        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existe producto con id ${pid}` });
        }
        let cart = await cartDBService.getCartById(cid);
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existe cart ${cid}` });        }

        let indiceProducto = cart.products.findIndex(p => p.product._id == pid);
        if (indiceProducto === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[indiceProducto].quantity++;
        }
        let cartActualizado = await cartDBService.updateCart(cid, cart);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ cartActualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const purchaseCart = async (req, res) => {
    let { cid } = req.params;
    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No existe carrito con id ${cid}` });
    }
    console.log(req.user);
    if (req.user.cart != cid) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El cart que quiere comprar no pertenece al usuario autenticado` });
    }
    try {
        let carrito = await cartDBService.getCartById(cid);
        if (!carrito) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existe carrito` });
        }
        const conStock = [];
        const sinStock = [];
        let error = false;
        console.log(JSON.stringify(carrito, null, 5));
        for (let i = 0; i < carrito.products.length; i++) {
            let codigo = carrito.products[i].product._id;
            let cantidad = carrito.products[i].quantity;
            let producto = await productDBService.getProductById(codigo);
            if (!producto) {
                error = true;
                sinStock.push({
                    product: codigo,
                    quantity: cantidad
                });
            } else {
                if (producto.stock >= cantidad) {
                    conStock.push({
                        codigo,
                        cantidad,
                        precio: producto.price,
                        descrip: producto.title,
                        subtotal: producto.price * cantidad
                    });
                    producto.stock = producto.stock - cantidad;
                    await productDBService.updateProduct(codigo, producto);
                } else {
                    error = true;
                    sinStock.push({
                        product: codigo,
                        quantity: cantidad
                    });
                }
            }
        }
        if (conStock.length == 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existen ítems en condiciones de ser facturados` });
        }
        let total = conStock.reduce((acum, item) => acum += item.cantidad * item.precio, 0);
        let email_comprador = req.user.email;
        let ticket = await ticketService.createTicket(total, email_comprador, conStock);
        carrito.products = sinStock;
        await cartDBService.updateCart(cid, carrito);
        if (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ ticket, alerta: `Atención: algún ítem no pudo ser procesado por falta de inventario. Consulte al administrador` });
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(ticket);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

