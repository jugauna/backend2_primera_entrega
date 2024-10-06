import { Router } from 'express';
import { auth } from '../middleware/auth.js';
export const router=Router()

router.get('/',(req,res)=>{

    res.status(200).render('home', {isLogin:req.session.usuario})
})

router.get('/registro',(req,res)=>{

    res.status(200).render('registro', {isLogin:req.session.usuario})
})

router.get('/login',(req,res)=>{

    res.status(200).render('login', {isLogin:req.session.usuario})
})

router.get('/perfil', auth, (req,res)=>{

    let usuario=req.session.usuario
    res.status(200).render('perfil', {
        usuario, isLogin:req.session.usuario
    })
})




