//http://localhost:3000/api/sessions/callbackGithub2
//Client ID: Iv23li2LEICKEkCAWA78
//Cliet Secret: 7e1b52c0dc23248ae0488965780eb4437ed3c9f9

import passport from "passport"
import local from "passport-local"
import github from "passport-github2"
import passportJWT from "passport-jwt"
import jwt from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UsuariosManager } from "../dao/UsuariosManager.js"
import { generaHash, validaHash } from "../utils.js"
import { config } from "./config.js"
import { usuariosModelo } from "../dao/models/usuarios.modelo.js";



export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];  // Extrae el token de la cookie 'jwt'
    }
    return token;
    console.log(token)
};

export const initPassport=()=>{
       
          // Configuración de la estrategia JWT
          const opts = {
            jwtFromRequest: cookieExtractor,  // Extrae el JWT de la cookie
            secretOrKey: config.SECRET    // Clave secreta para verificar el token JWT
        };

        

    passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
        console.log("JWT Payload:", jwt_payload);  // Verifica el contenido del JWT
        try {
            const user = await usuariosModelo.findById (jwt_payload._id);  // Usar el modelo User para buscar en la base de datos
            console.log("User Found:", user);  // Verifica si se encontró el usuario
            if (user) {
                return done(null, user);  // Si el usuario existe, devolver el usuario
            } else {
                return done(null, false);  // Si no existe, devolver falso
            }
        } catch (error) {
            return done(error, false);  // Si hay un error, devolver el error
        }
    }));

    const logout = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                credentials: 'include' // Esto asegura que las cookies se envíen con la solicitud
            });
    
            if (response.ok) {
                alert('Logout exitoso');
                window.location.href = '/login';  // Redireccionar al usuario después del logout
            } else {
                alert('Error al intentar hacer logout');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
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
                    let {first_name, last_name, edad, rol}=req.body
                    if(!first_name || !rol){
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
                    let nuevoUsuario=await UsuariosManager.create({first_name, last_name, edad, email:username, password, rol})
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

    // const logout = async () => {
    //     try {
    //         const response = await fetch('/logout', {
    //             method: 'POST',
    //             credentials: 'include' // Esto asegura que las cookies se envíen con la solicitud
    //         });
    
    //         if (response.ok) {
    //             alert('Logout exitoso');
    //             window.location.href = '/login';  // Redireccionar al usuario después del logout
    //         } else {
    //             alert('Error al intentar hacer logout');
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };
    

    
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
                //console.log(profile._json.name)
                console.log(profile._json.name)
                if (!user) {
                    // Si no existe, crear un nuevo usuario
                    user = await UsuariosManager.create({                    
                    first_name: profile._json.name,  // Nombre del perfil obtenido de GitHub
                    email: profile._json.email,  // Email obtenido de GitHub
                    rol: "Usuario",  // Rol por defecto asignado al nuevo usuario
                    profileGithub: profile
                });
                }
                // Continuar con el proceso de autenticación, pasando el usuario
                console.log('Usuario Logueado con Passport-github!!!')                
                return done(null, user);
            } catch (error) {
                // Si hay un error, se lo pasamos a Passport
                return done(error);
                }
            }
        )
    );    
    passport.use("current", 
            new passportJWT.Strategy(
                {
                    secretOrKey: config.SECRET, 
                    jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([cookieExtractor])
                },
                async(usuario, done)=>{
                    try {
                        return done(null, usuario)
                    } catch (error) {
                        return done(error)
                    }
                }
            )
        )


    // passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
    //     try {
    //         const user = await usuariosModelo.findById (jwt_payload._id);  // Usar el modelo User para buscar en la base de datos
    //         if (user) {
    //             return done(null, user);  // Si el usuario existe, devolver el usuario
    //         } else {
    //             return done(null, false);  // Si no existe, devolver falso
    //         }
    //     } catch (error) {
    //         return done(error, false);  // Si hay un error, devolver el error
    //     }
    // }));

    // passport.use("current", 
    //     new passportJWT.Strategy(
    //         {
    //             secretOrKey: config.SECRET, 
    //             jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([cookieExtractor])
    //         },
    //         async(usuario, done)=>{
    //             try {
    //                 return done(null, usuario)
    //             } catch (error) {
    //                 return done(error)
    //             }
    //         }
    //     )
    // )
    


// paso 1 bis   // SOLO SI USO SESSIONS...!!!
//passport.serializeUser((usuario, done)=>{
//    return done(null, usuario._id)
//})

//passport.deserializeUser(async(id, done)=>{
//    let usuario=await UsuariosManager.getUserBy({_id:id})
//    return done(null, usuario)
//})

}
export default passport;