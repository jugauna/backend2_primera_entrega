import { Router } from 'express';
import { auth } from '../middleware/auth.js';
//import { config } from '../config/config.js';
//import passport from 'passport';
export const router=Router()

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
    console.log(req.user);
    let usuario = req.user;
    res.status(200).render('perfil', {usuario, isLogin: req.user});
});

router.get('/current', auth, (req, res) => {
    console.log(req.user);
    let usuario = req.user;
    res.status(200).render('perfil', {usuario, isLogin: req.user});
});