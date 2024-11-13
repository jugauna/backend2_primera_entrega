import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Asegúrate de que el nombre del modelo sea consistente
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

export const ticketModel = mongoose.model('Ticket', ticketSchema);
