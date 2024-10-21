import jwt from "jsonwebtoken"
import { config } from "../config/config.js";
//import passport from '../config/passport.config.js';

export const auth = (req, res, next) => {
    console.log('Cookies:', req.cookies);  // Verifica las cookies en la consola
    // Verifica si existe la cookie con el token JWT
    const token = req.cookies.tokenCookie;  // Usa el nombre correcto de la cookie
    if (!token) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: 'Unauthorized - no llega token' });
    }

    console.log('Token extraído:', token);  // Log para depuración

    // Intenta verificar el token
    try {
        // Verifica el token y agrega el payload (usuario) al request
        req.user = jwt.verify(token, config.SECRET);
        console.log('Usuario autenticado:', req.user);  // Log para ver los datos del usuario
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ error: `Error de autenticación: ${error.message}` });
    }

    // Si todo está bien, continúa al siguiente middleware
    next();
};


// export const auth=(req, res, next)=>{
//     console.log(req.cookies)
//     if(!req.cookies.jwt){
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`Unauthorized - no llega token`})
//     }
//     console.log(req.headers.authorization)
//     let token=req.cookies.jwt  
//     try {
//         req.user=jwt.verify(token, config.SECRET)
//     } catch (error) {
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`${error.message}`})
//     }
//     next()
// }


// export const auth=rol=>{
//     return (req, res, next)=>{
//         if(!req.user || !req.user?.rol){
//             res.setHeader('Content-Type','application/json');
//             return res.status(403).json({error:`No autorizado - no hay rol`})
//         }
     
//         if(req.user.rol!==rol){
//             res.setHeader('Content-Type','application/json');
//             return res.status(403).json({error:`No autorizado - privilegios insuficientes`})
//         }
//         next()
//     }
// }