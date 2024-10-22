//http://localhost:3000/api/sessions/callbackGithub2
//Client ID: Iv23li2LEICKEkCAWA78
//Cliet Secret: 7e1b52c0dc23248ae0488965780eb4437ed3c9f9

import passport from "passport"
import local from "passport-local"
import github from "passport-github2"
import passportJWT from "passport-jwt"
//import jwt from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UsuariosManager } from "../dao/UsuariosManager.js"
import { generaHash, validaHash } from "../utils.js"
import { config } from "./config.js"
import { usuariosModelo } from "../dao/models/usuarios.modelo.js";



export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];  
    }
    return token;
    console.log(token)
};

export const initPassport=()=>{
    const opts = {
        jwtFromRequest: cookieExtractor,  
        secretOrKey: config.SECRET    
    };
    
    passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
        console.log("JWT Payload:", jwt_payload);  
        try {
            const user = await usuariosModelo.findById (jwt_payload._id);  
            console.log("User Found:", user);  
            if (user) {
                return done(null, user); 
            } else {
                return done(null, false); 
            }
        } catch (error) {
            return done(error, false); 
        }
    }));
    
    const logout = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                credentials: 'include' 
            });    
            if (response.ok) {
                alert('Logout exitoso');
                window.location.href = '/login';  
            } else {
                alert('Error al intentar hacer logout');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
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
    
    passport.use("github", 
        new github.Strategy(
            {
                clientID: "Iv23li2LEICKEkCAWA78",  
                clientSecret: "7e1b52c0dc23248ae0488965780eb4437ed3c9f9",  
                callbackURL: "http://localhost:3000/api/sessions/callbackGithub2",
                session: false 
            },
        async (token, rt, profile, done) => {
            try {
                // Buscar si el usuario ya existe en la base de datos
                let user = await UsuariosManager.getUserBy({ email: profile._json.email});
                //console.log(profile._json.name)
                console.log(profile._json.name)
                if (!user) {
                    user = await UsuariosManager.create({                    
                    first_name: profile._json.name, 
                    email: profile._json.email, 
                    rol: "Usuario",  
                    profileGithub: profile
                });
                }
                console.log('Usuario Logueado con Passport-github!!!')                
                return done(null, user);
            } catch (error) {
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