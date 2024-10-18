//http://localhost:3000/api/sessions/callbackGithub2
//Client ID: Iv23li2LEICKEkCAWA78
//Cliet Secret: 7e1b52c0dc23248ae0488965780eb4437ed3c9f9

import passport from "passport"
import local from "passport-local"
import github from "passport-github2"
import passportJWT from "passport-jwt"
import { UsuariosManager } from "../dao/UsuariosManager.js"
import { generaHash, validaHash } from "../utils.js"
import { config } from "./config.js"

const buscarToken=req=>{
    let token=null

    if(req.cookies.tokenCookie){
        console.log(`passport recibe token...!!!`)
        token=req.cookies.tokenCookie
    }    

    return token
}

export const initPassport=()=>{
    // paso 1
    passport.use("registro", 
        new local.Strategy(
            {
                passReqToCallback: true, 
                usernameField: "email"
            },
            async(req, username, password, done)=>{
                console.log("ingresa")
                try {
                    let {nombre, rol}=req.body
                    if(!nombre || !rol){
                        //console.log(`Faltan datos`)
                        return done(null, false, { message: "Nombre y rol son obligatorios" })
                    }
                    let existe=await UsuariosManager.getUserBy({email:username})
                    if(existe){
                        //console.log(`existe`)
                        //console.log(existe)
                        return done(null, false, {message:`Ya existe un usuario con email ${username}`})
                    }
                    password=generaHash(password)
                    let nuevoUsuario=await UsuariosManager.create({nombre, email:username, password, rol})
                    console.log(`Registro por passport...!!!`)
                    return done(null, nuevoUsuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use("login", 
        new local.Strategy(
            {
                usernameField:"email"
            },
            async(username, password, done)=>{
                try {
                    let usuario=await UsuariosManager.getUserBy({email:username})
                    if(!usuario){
                        return done(null, false)
                    }
                    if(!validaHash(password, usuario.password)){
                        return done(null, false)
                    }
                    // limpiar data sensible / confidencial...
                    delete usuario.password
                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use("current", 
        new passportJWT.Strategy(
            {
                secretOrKey: config.SECRET, 
                jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([buscarToken])
            },
            async(usuario, done)=>{
                try {
                    //if(usuario.nombre==="Julian"){
                    //return done(null, false)
                    //}
                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )



// paso 1:
    // passport.use("github", 
    //     new github.Strategy(
    //         {
    //             clientID:"Iv23li2LEICKEkCAWA78",
    //             clientSecret:"7e1b52c0dc23248ae0488965780eb4437ed3c9f9",
    //             callbackURL:"http://localhost:3000/api/sessions/callbackGithub2"
    //         },
    //         async (token, rt, profile, done)=>{
    //             try {
    //                 // console.log(profile)
    //                 let {name, email}=profile._json
    //                 if(!name || !email){
    //                     return done(null, false)
    //                 }
    //                 let usuario=await UsuariosManager.getUserBy({email})
    //                 if(!usuario){
    //                     usuario=await UsuariosManager.create({nombre: name, email, profileGithub: profile})
    //                 }
    //                 return done(null, usuario)
    //             } catch (error) {
    //                 return done(error)
    //             }
    //         }
    //     )
    // )

    passport.use("github", 
        new github.Strategy(
            {
                clientID: "Iv23li2LEICKEkCAWA78",  // ID del cliente de la aplicación de GitHub
                clientSecret: "7e1b52c0dc23248ae0488965780eb4437ed3c9f9",  // Secreto del cliente proporcionado por GitHub
                callbackURL: "http://localhost:3000/api/sessions/callbackGithub2",  // URL a la que GitHub redirige después de la autenticación
                session: false  // Deshabilitar las sesiones para esta estrategia
            },
        async (token, rt, profile, done) => {
            try {
                // Buscar si el usuario ya existe en la base de datos
                let user = await UsuariosManager.getUserBy({ email: profile._json.email});
                if (!user) {
                    // Si no existe, crear un nuevo usuario
                    user = await UsuariosManager.create({
                    nombre: profile._json.nombre,  // Nombre del perfil obtenido de GitHub
                    email: profile._json.email,  // Email obtenido de GitHub
                    rol: "Usuario"  // Rol por defecto asignado al nuevo usuario
                });
                }
                // Continuar con el proceso de autenticación, pasando el usuario
                return done(null, user);
            } catch (error) {
                // Si hay un error, se lo pasamos a Passport
                return done(error);
                }
            }
        )
    );      

// paso 1 bis   // SOLO SI USO SESSIONS...!!!
//passport.serializeUser((usuario, done)=>{
//    return done(null, usuario._id)
//})

//passport.deserializeUser(async(id, done)=>{
//    let usuario=await UsuariosManager.getUserBy({_id:id})
//    return done(null, usuario)
//})

}