import { Router } from 'express';
import { UsuariosManager } from '../dao/UsuariosManager.js';
import passport from 'passport';
import jwt from "jsonwebtoken";
import config from '../config/config.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { cookieExtractor } from '../config/passport.config.js';
import { UsuariosDTO } from '..//dto/UsuariosDTO.js';
import { usuariosModelo } from '../dao/models/usuarios.modelo.js';

export const router=Router()


router.get("/error", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(401).json({error:`Error al autenticar`})
})

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
        let { web } = req.body;
        // Si la autenticación es exitosa, passport deja los datos del usuario en req.user
        if (!req.user) {
            return res.status(401).json({ error: 'Autenticación fallida' });
        }
        const usuario = new UsuariosDTO(req.user);
        console.log(usuario);
        console.log(usuario.cart);
        console.log(usuario._id);
        console.log(req.user._id);        
        const token = jwt.sign({ id: usuario._id, first_name: usuario.first_name, email: usuario.email, rol: usuario.rol }, config.SECRET, { expiresIn: '1h' });
        res.cookie("tokenCookie", token, { httpOnly: true });
        if (req.user.rol === "Administrador") {
            console.log('Administrador Logueado con Passport!!!');
            return res.status(200).json({
                payload: `Login exitoso para ${req.user.first_name} Rol: ${req.user.rol}`,
                usuarioLogueado: req.user,
                token,
                redirectUrl: "/realtimeproducts"
            });
        } else {
            console.log('Usuario Logueado con Passport!!!');
            return res.status(200).json({
                payload: `Login exitoso User: ${req.user.first_name} Rol: ${req.user.rol} Id: ${req.user._id}`,
                usuarioLogueado: req.user,
                token,
                redirectUrl: "/products" // Redirigir al usuario común a /products
            });
        }
    }
);

router.post('/logout', (req, res) => {
    res.clearCookie('tokenCookie');  
    res.status(200).json({ message: 'Logout exitoso' });
});

router.get('/github',
    passport.authenticate("github", { session: false })  
);

router.get("/callbackGithub2", 
    passport.authenticate("github", { session: false, failureRedirect: "/api/sessions/error" }),
    (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Autenticación fallida' });
    }
    const token = jwt.sign({ id: req.user._id, first_name: req.user.first_name,  email: req.user.email, rol: req.user.rol }, config.SECRET, { expiresIn: '1h' });
    console.log(token)
    res.cookie("tokenCookie", token, {httpOnly: true});
    res.redirect("/products");
    }
);

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Usuario no autorizado' });
    }    
    res.status(200).json({
        message: 'Usuario autenticado',
        user: req.user
    });
});