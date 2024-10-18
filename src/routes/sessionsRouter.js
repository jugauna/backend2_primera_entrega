import { Router } from 'express';
//import { UsuariosManager } from '../dao/UsuariosManager.js';
import passport from 'passport';
import jwt from "jsonwebtoken"
import { config } from '../config/config.js';
//import { passportCall } from '../utils.js';
export const router=Router()

router.get("/error", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(401).json({error:`Error al autenticar`})
})

// router.get('/check-login', (req, res)=>{
//     // Obtener el token desde la cookie
//     const token = req.cookies.tokenCookie;  
//     // Si no hay token, significa que no está logueado
//     if (!token) {
//         return res.status(200).json({ isLoggedIn: false, user: null });
//     }  
//     // Verificar el token
//     jwt.verify(token, config.SECRET, (err, decoded) => {
//         if (err) {
//         return res.status(200).json({ isLoggedIn: false, user: null });
//     }
//     // Si el token es válido, devolver que el usuario está logueado y enviar los datos del usuario
//       return res.status(200).json({ isLoggedIn: true, user: decoded });
//     });
//   });

// paso 3:
router.post(
    "/registro",
    passport.authenticate("registro", {session: false, failureRedirect:"/api/sessions/error"}),
    //passportCall("registro"),
    (req, res)=>{
        // req.user // lo deja passport.authenticate si todo sale OK
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({payload:`Registro exitoso para ${req.user.nombre}`, usuario:req.user});
    }
)

// router.post(
//     "/login",
//     passport.authenticate("login", {session: false, failureRedirect:"/api/sessions/error"}),
//     (req, res)=>{
//         // req.user // lo deja passport.authenticate si todo sale OK
//         let token=jwt.sign(req.user, config.SECRET, {expiresIn: 3600})
//         res.cookie("tokenCookie", token, {httpOnly:true})
//         res.setHeader('Content-Type','application/json');
//         return res.status(201).json({payload:`Login exitoso para ${req.user.nombre}`, usuarioLogueado:req.user, token});
//         //return res.status(201).json({payload:`Login exitoso para ${req.user.nombre}`, usuarioLogueado:req.user});
        
//     }
// )

//const jwt = require('jsonwebtoken');
//const config = require('./config'); // Asegúrate de tener una configuración con tu clave secreta

//const jwt = require('jsonwebtoken');
//const config = { SECRET: 'tuSecretoJWT' }; // Cambia por tu clave secreta

router.post(
  "/login",
  passport.authenticate("login", { session: false, failureRedirect: "/api/sessions/error" }),
  (req, res) => {
    // Si la autenticación es exitosa, passport deja los datos del usuario en req.user
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticación fallida' });
    }
    // Generar el token JWT con los datos del usuario
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, rol: req.user.rol }, 
      config.SECRET, 
      { expiresIn: '1h' } // El token expira en 1 hora
    );
    // Guardar el token en una cookie segura y solo accesible por el servidor
    res.cookie("tokenCookie", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production' // Solo usar https en producción
    });
    // Verificar el rol del usuario y redirigir según sea necesario
    if (req.user.rol === "Administrador") {
      return res.status(200).json({
        payload: `Login exitoso para ${req.user.nombre} Rol: ${req.user.rol}`,
        usuarioLogueado: req.user,
        token,
        redirectUrl: "/realtimeproducts" // Redirigir al administrador a /realtimeproducts
      });
    } else {
      return res.status(200).json({
        payload: `Login exitoso User: ${req.user.nombre} Rol: ${req.user.rol}`,
        usuarioLogueado: req.user,
        token,
        redirectUrl: "/products" // Redirigir al usuario común a /products
      });
    }
  }
);



// router.get(
//     "/logout", 
//     (req, res)=>{
//     let {web}=req.query
//     req.session.destroy(error=>{
//         if(error){
//             res.setHeader('Content-Type','application/json');
//             return res.status(500).json({error:`Error al realizar logout`})
//         }
//         if(web){
//             return res.redirect("/login?mensaje=Logout exitoso")
//         }else{
//             res.setHeader('Content-Type','application/json');
//             return res.status(200).json({payload:"Logout exitoso...!!!"});
//         }
//     })
// })

router.post('/logout', (req, res) => {
    // Al utilizar JWT, no almacenamos sesiones en el servidor, por lo que cerrar sesión implica:
    // 1. Borrar la cookie que contiene el token.
    // 2. Responder al cliente que la sesión ha finalizado.
  
    // Borrar la cookie que contiene el token JWT
    res.clearCookie('tokenCookie');
  
    // Responder con un mensaje de cierre de sesión exitoso
    return res.status(200).json({ message: 'Logout exitoso' });
  });
  

// router.get('/github',
//     passport.authenticate("github", {}),    
// )

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
    const token = jwt.sign(
        { id: req.user._id, email: req.user.email, rol: req.user.rol }, 
        config.SECRET, 
        { expiresIn: '1h' }
    );
    // Guardar el token en una cookie segura
    res.cookie("tokenCookie", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production'  // Solo usar HTTPS en producción
    });
    // Redirigir según el rol del usuario
    if (req.user.rol === "Administrador") {
        return res.redirect("/realtimeproducts");
    } else {
        return res.redirect("/products");
    }
    }
);

// paso 3
// router.get("/callbackGithub2",
//     passport.authenticate("github",{failureRedirect:"/api/sessions/error"}),
//     (req, res)=>{
//         // req.user   generado por el middleware passport si todo sale OK en el authencicate...!!!
//         //req.session.usuario=req.user
//         console.log(`login OK con Passport-Github...!!!`)
//         return res.redirect("/products");
        
//         //res.setHeader('Content-Type','application/json');
//         //return res.status(200).json({payload:"Login exitoso", usuarioLogueado: req.user});
//     }
// )

// router.get("/callbackGithub2",
//     passport.authenticate("github", { failureRedirect: "/api/sessions/error" }),
//     (req, res) => {
//         // req.user contiene la información del usuario autenticado si la autenticación fue exitosa
//         console.log(`login OK con Passport-Github...!!!`);
//         // Redirigir según el rol del usuario
//         if (req.user.rol === "Administrador") {
//             return res.redirect("/realtimeproducts");
//         } else {
//             return res.redirect("/products");
//         }
//     }
// );