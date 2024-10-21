import { Router } from 'express';
import { UsuariosManager } from '../dao/UsuariosManager.js';
import passport from 'passport';
import jwt from "jsonwebtoken"
import { config } from '../config/config.js';
//import { auth } from '../middleware/auth.js';
//import { generaHash, validaHash } from '../utils.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { cookieExtractor } from '../config/passport.config.js';
export const router=Router()



router.get("/error", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(401).json({error:`Error al autenticar`})
})

// Configuración de la estrategia JWT
const opts = {
    jwtFromRequest: cookieExtractor,  // Extrae el JWT de la cookie
    secretOrKey: config.SECRET    // Clave secreta para verificar el token JWT
};

// Estrategia JWT
passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log("JWT Payload:", jwt_payload);     
    try {
        // Busca al usuario por el id que viene en el JWT
        const user = await UsuariosManager.getUserBy(jwt_payload._id);
        if (user) {
            return done(null, user);  // Si el usuario existe, devuelve el usuario
        } else {
            return done(null, false);  // Si no existe, devuelve falso
        }
    } catch (error) {
        return done(error, false);  // Si hay un error, lo maneja
    }
}));

// paso 3:
router.post(
    "/registro",
    passport.authenticate("registro", {session: false, failureRedirect:"/api/sessions/error"}),
    //passportCall("registro"),
    (req, res)=>{
        return res.status(201).json({payload:`Registro exitoso para ${req.user.nombre}`, usuario:req.user});
    }
)

router.post(
    "/login",
    passport.authenticate("login", { session: false, failureRedirect: "/api/sessions/error" }),
    (req, res) => {
    // Si la autenticación es exitosa, passport deja los datos del usuario en req.user
    if (!req.user) {
        return res.status(401).json({ error: 'Autenticación fallida' });
        }
        // Generar el token JWT con los datos del usuario
        const token = jwt.sign(req.user, config.SECRET, { expiresIn: '3h' }
        //const token = jwt.sign({ id: req.user._id, email: req.user.email, rol: req.user.rol }, config.SECRET, { expiresIn: '1h' } // El token expira en 1 hora
    );
    // Guardar el token en una cookie segura y solo accesible por el servidor
    res.cookie("tokenCookie", token, {httpOnly: true});
        // Verificar el rol del usuario y redirigir según sea necesario
        if (req.user.rol === "Administrador") {
            console.log('Administrador Logueado con Passport!!!')
            return res.status(200).json({
                payload: `Login exitoso para ${req.user.first_name} Rol: ${req.user.rol}`,
                usuarioLogueado: req.user,
                token,
                redirectUrl: "/realtimeproducts" // Redirigir al administrador a /realtimeproducts
                });
                } else {
                    console.log('Usuario Logueado con Passport!!!')
                    return res.status(200).json({
                        payload: `Login exitoso User: ${req.user.first_name} Rol: ${req.user.rol}`,
                        usuarioLogueado: req.user,
                        token,
                        redirectUrl: "/products" // Redirigir al usuario común a /products
                        });
                    }
                }
            );

// Ruta de logout para Passport con JWT
router.post('/logout', (req, res) => {
    // Eliminamos la cookie que contiene el token JWT
    res.clearCookie('tokenCookie');  // El nombre de la cookie debería ser 'jwt' o lo que hayas usado
    res.status(200).json({ message: 'Logout exitoso' });
});

router.get('/github',
    passport.authenticate("github", { session: false })  // Deshabilitar sesiones aquí también
    );

router.get("/callbackGithub2", 
    passport.authenticate("github", { session: false, failureRedirect: "/api/sessions/error" }),
    (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Autenticación fallida' });
    }
    // Generar token JWT con los datos del usuario autenticado
    //const token = jwt.sign(req.user, config.SECRET, { expiresIn: '3h' });
    //console.log(token)
    const token = jwt.sign({ id: req.user._id, first_name: req.user.first_name,  email: req.user.email, rol: req.user.rol }, config.SECRET, { expiresIn: '3h' });
    console.log(token)
    // Guardar el token en una cookie segura
    res.cookie("tokenCookie", token, {httpOnly: true});
    // Redirigir según el rol del usuario
    //if (req.user.rol === "Administrador") {
    //    return res.redirect("/realtimeproducts");
   // } else {
        return res.redirect("/products");
    //}
    }
);

// Ruta protegida con Passport JWT
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Si la autenticación es exitosa, `req.user` contendrá el usuario
    if (!req.user) {
        return res.status(401).json({ message: 'Usuario no autorizado' });
    }
    // Devolver los datos del usuario autenticado
    res.status(200).json({
        message: 'Usuario autenticado',
        user: req.user
    });
});
