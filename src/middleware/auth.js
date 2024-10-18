import jwt from "jsonwebtoken"
import { config } from "../config/config.js";


//const passportJWT = require('passport-jwt');
//const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

// passport.use(new JwtStrategy({
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extraer el token desde la cabecera Authorization: Bearer <token>
//   secretOrKey: config.SECRET
// }, async (jwtPayload, done) => {
//   try {
//     const user = await UsuariosManager.getById(jwtPayload.id);
//     if (user) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//     }
//   } catch (error) {
//     return done(error, false);
//   }
// }));

export const auth=(req, res, next)=>{

    console.log(req.cookies)
    if(!req.cookies.tokenCookie){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Unauthorized - no llega token`})
    }
    // console.log(req.headers.authorization)
    let token=req.cookies.tokenCookie    
    try {
        req.user=jwt.verify(token, config.SECRET)
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`${error.message}`})
    }
    next()
}

// export const auth=roles=>{
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

// export const auth2=(roles=[])=>{
//     return (req, res, next)=>{
//         if(!Array.isArray(roles)){
//             res.setHeader('Content-Type','application/json');
//             return res.status(500).json({error:`Error en permisos de la ruta`})
//         }
//         roles=roles.map(rol=>rol.toLowerCase())
//         if(roles.includes("Usuario")){
//             return next()
//         } 

//         if(!req.user || !req.user?.rol){
//             res.setHeader('Content-Type','application/json');
//             return res.status(403).json({error:`No autorizado - no hay rol`})
//         }
        
//         if(!roles.includes(req.user.rol.toLowerCase())){
//             res.setHeader('Content-Type','application/json');
//             return res.status(403).json({error:`No autorizado - privilegios insuficientes`})
//         }

//         next()
//     }
// }

