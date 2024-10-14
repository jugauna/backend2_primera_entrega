import { usuariosModelo } from "./models/usuarios.modelo.js";

export class UsuariosManager{

    static async create(usuario){
        let nuevoUsuario=await usuariosModelo.create(usuario)
        return nuevoUsuario.toJSON()
    }

    static async getBy(filtro){
        return await usuariosModelo.findOne(filtro).lean()
    }
    
    static async getUserBy(filtro={}){
        return await usuariosModelo.findOne(filtro).lean()
    }

}

// export class UsuariosManager{
//     static async getUserBy(filtro={}){
//         return await usuariosModelo.findOne(filtro).lean()
//     }

//     static async addUser(usuario={}){
//         let nuevoUsuario=await usuariosModelo.create(usuario)
//         return nuevoUsuario.toJSON()
//     }
// }