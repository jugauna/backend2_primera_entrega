import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { config } from '../config/config.js';
import passport from 'passport';
export const router=Router()
//import { isAuthenticated } from '../middleware/auth.js';
//import { current } from '../config/passport.config.js';

router.get('/',(req,res)=>{

    res.status(200).render('home')
})

router.get('/registro',(req,res)=>{

    res.status(200).render('registro')
})

router.get('/login',(req,res)=>{

    res.status(200).render('login')
})

router.get('/perfil', auth, (req, res) => {
    // Verifica si el usuario está disponible
    console.log(req.user);  // Esto debería mostrar los datos del usuario autenticado en la consola
    let usuario = req.user;
    // Asegúrate de que `usuario` se pase a la vista
    res.status(200).render('perfil', {usuario, isLogin: req.user});
});

// router.get('/current', auth, (req, res) => {
//     // Verifica si el usuario está disponible
//     console.log(req.user);  // Esto debería mostrar los datos del usuario autenticado en la consola
//     let usuario = req.user;
//     // Asegúrate de que `usuario` se pase a la vista
//     res.status(200).render('current', {usuario, isLogin: req.user});
// });
// router.get('/perfil', auth, (req,res)=>{
//     let usuario=req.user
//     res.status(200).render('perfil', {
//         usuario, isLogin:req.user
//     })
// })
