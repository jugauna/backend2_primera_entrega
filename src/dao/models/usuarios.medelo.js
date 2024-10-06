import mongoose from 'mongoose'

export const usuariosModelo=mongoose.model('usuarios',new mongoose.Schema({
    nombre: String,
    email:{
        type: String, unique:true, lowercase: true
    }, 
    password: String,
    rol: String, 
    signupDate: { type: Date, default: Date.now() }   
}))

