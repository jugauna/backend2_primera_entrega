import { Router } from 'express';
import { auth } from '../middleware/auth.js';
export const router=Router()

router.get('/', auth, (req,res)=>{

    let productos=[{id:1, title:"Martillo"}]

    res.setHeader('Content-Type','application/json')
    res.status(200).json({productos})
})