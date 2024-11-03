// errorHandler.js
export function errorHandler(err, req, res, next) {
    if (err.message.includes('El carrito')) {
        return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
}
