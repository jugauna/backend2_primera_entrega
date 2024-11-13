import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product" // Asegúrate de que el nombre del modelo sea consistente
            },
            quantity: Number
        }
    ]
});

export const cartModel = mongoose.model("Carts", cartSchema);
