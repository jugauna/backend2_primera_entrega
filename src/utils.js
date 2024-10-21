import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt"
//import passport from "passport"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const generaHash=password=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
export const validaHash=(pass, hash)=>{
    return bcrypt.compareSync(pass, hash)
}
// export const cookieExtractor = (req) => {
//     let token = null;
//     if (req && req.cookies) {
//         token = req.cookies['jwt'];  // Extrae el token de la cookie 'jwt'
//     }
//     return token;
// };


// export const auth=(req, res, next)=>{
//     console.log(req.cookies)
//     if(!req.cookies.tokenCookie){
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`Unauthorized - no llega token`})
//     }
//     console.log(req.headers.authorization)
//     console.log(`passport recibe token...!!!`)
//     let token=req.cookies.tokenCookie    
//     try {
//         req.user=jwt.verify(token, config.SECRET)
//     } catch (error) {
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`${error.message}`})
//     }
//     next()
// }


export default __dirname;


// export const procesaErrores=(res, error)=>{
//     console.log(error);
//     res.setHeader('Content-Type','application/json');
//     return res.status(500).json(
//         {
//             error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
//             detalle:`${error.message}`
//         }
//     )
// }

// export const passportCall=estrategia=>function (req, res, next) {
//     passport.authenticate(estrategia, function (err, user, info, status) {
//         if (err) { return next(err) }   // return done(error)
//         if (!user) { // return done(null, false)
//             res.setHeader('Content-Type','application/json');
//             return res.status(401).json({error:`${info.message?info.message:info.toString()}`})
//         }  
//         req.user=user;   // return done(null, usuario)
//         return next()
//     })(req, res, next);
// }