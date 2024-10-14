// import mongoose from 'mongoose'

// export const usuariosModelo=mongoose.model(
//     'usuarios',
//     new mongoose.Schema(
//         {
//             nombre: String,
//             email:{
//                 type: String, unique:true
//             },
//             password: String,
//             rol: String,
//             signupDate: {
//                 type: Date, default: Date.now()
//             }
//             // {
//             //     timestamps:true, 
//             //     strict: false
//             // }
//         }
//     )
// )

import mongoose from "mongoose";

export const usuariosModelo=mongoose.model(
    'usuarios',
    new mongoose.Schema(
        {
            nombre: String, 
            email: {
                type: String, unique:true
            }, 
            apellido: String, 
            password: String,
        },
        {
            timestamps:true, 
            strict: false
        }
    )
)
