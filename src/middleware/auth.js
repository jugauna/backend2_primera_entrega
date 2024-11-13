import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { Router } from 'express';

export const auth = (req, res, next) => {
    console.log('Cookies:', req.cookies);  
    const token = req.cookies.tokenCookie; 
    if (!token) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: 'Unauthorized - no llega token' });
    }
    console.log('Token extraído:', token);  
    try {
        req.user = jwt.verify(token, config.SECRET);
        console.log('Usuario autenticado:', req.user);  
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `Error de autenticación: ${error.message}` });
    }
    next();
};