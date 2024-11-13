import { ticketModel } from '../dao/models/ticketModel.js';
import { v4 as uuidv4 } from 'uuid';

class TicketService {
    async createTicket(amount, purchaser, products) {
        const code = uuidv4();
        const ticket = new ticketModel({
            code,
            purchase_datetime: new Date(),
            amount,
            purchaser,
            products
        });
        return ticket.save();
    }

    async getAllTickets() {
        return ticketModel.find().populate('products.product').lean();
    }
}

export default TicketService;