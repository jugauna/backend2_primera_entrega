import { Router } from 'express';
import TicketService from '../services/TicketService.js';

const router = Router();
const ticketService = new TicketService();

router.post('/tickets', async (req, res, next) => {
    try {
        const { amount, purchaser } = req.body;
        await ticketService.createTicket(amount, purchaser);
        res.redirect('/tickets');
    } catch (err) {
        next(err);
    }
});

router.get('/api/tickets', async (req, res, next) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.json({ tickets });
    } catch (err) {
        next(err);
    }
});

export default router;