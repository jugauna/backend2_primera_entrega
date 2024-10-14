//http://localhost:3000/api/sessions/callbackGithub2
//Client ID: Iv23li2LEICKEkCAWA78
//Cliet Secret: 7e1b52c0dc23248ae0488965780eb4437ed3c9f9


import passport from "passport"
import local from "passport-local"
import github from "passport-github2"
import { UsuariosManager } from "../dao/UsuariosManager.js"
import { generaHash, validaHash } from "../utils.js"


export const initPassport=()=>{

    passport.use("registro", 
        new local.Strategy(
            {
                usernameField:"email", 
                passReqToCallback: true
            },
            async(req, username, password, done)=>{
                try {
                    let {nombre, rol}=req.body
                    if(!nombre || !rol){
                        return done(null, false, { message: "Nombre y rol son obligatorios" })
                    }                    
                    let existe=await UsuariosManager.getBy({email:username})
                    if(existe){
                        return done(null, false)
                    }
                    password=generaHash(password)
                    let nuevoUsuario=await UsuariosManager.create({nombre, email:username, password, rol})
                    console.log(`Registro por passport...!!!`)
                    return done(null, nuevoUsuario)
                } catch (error) {
                    return done(error) // done(null, false) o return done(null, usuario)
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
                    let usuario=await UsuariosManager.getBy({email:username})
                    if(!usuario){
                        return done(null, false)
                    }
                    if(!validaHash(password, usuario.password)){
                        return done(null, false)
                    }
                    console.log(`login OK con Passport-Local...!!!`)
                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )



// paso 1:
    passport.use("github", 
        new github.Strategy(
            {
                clientID:"Iv23li2LEICKEkCAWA78",
                clientSecret:"7e1b52c0dc23248ae0488965780eb4437ed3c9f9",
                callbackURL:"http://localhost:3000/api/sessions/callbackGithub2"
            },
            async (token, rt, profile, done)=>{
                try {
                    // console.log(profile)
                    let {name, email}=profile._json
                    if(!name || !email){
                        return done(null, false)
                    }
                    let usuario=await UsuariosManager.getUserBy({email})
                    if(!usuario){
                        usuario=await UsuariosManager.addUser({nombre: name, email, profileGithub: profile})
                    }
                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    // passport.use("login", 
    //     new local.Strategy(
    //         {
    //             usernameField:"email"
    //         },
    //         async(username, password, done)=>{
    //             try {
    //                 // logica de login... validaciones... etc...
    //                 return done(null, {nombre:"Juan", email: "juan@test.com"})
    //             } catch (error) {
    //                 return done(error)
    //             }
    //         }   
    //     )
    // )




// // paso 1' (serializers...) SOLO si uso Sessions...!!!
//     passport.serializeUser((user, done)=>{
//         return done(null, user)
//     })
//     passport.deserializeUser((user, done)=>{
//         return done(null, user)
//     })

// }

// paso 1 bis   // SOLO SI USO SESSIONS...!!!
passport.serializeUser((usuario, done)=>{
    return done(null, usuario._id)
})

passport.deserializeUser(async(id, done)=>{
    let usuario=await UsuariosManager.getBy({_id:id})
    return done(null, usuario)
})

}