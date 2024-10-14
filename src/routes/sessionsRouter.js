import { Router } from 'express';
import { UsuariosManager } from '../dao/UsuariosManager.js';
import crypto from "crypto"
import { config } from '../config/config.js';
import passport from 'passport';
export const router=Router()

router.get("/error", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(401).json({error:`Error al autenticar`})
})

// paso 3
router.post(
    "/registro", 
    passport.authenticate("registro", {failureRedirect:"/api/sessions/error"}), 
    (req, res)=>{
        // si sale bien el authenticate, passport deja un req.user, con los datos del usuario
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({payload:"Registro exitoso", nuevoUsuario:req.user});
    }
)

router.post(
    "/login", 
    passport.authenticate("login", {failureRedirect:"/api/sessions/error"}),
    (req, res)=>{
        req.session.usuario=req.user
        console.log(req.user.email)
        //console.log(`login OK con Passport-Local...!!!`)
        // si sale bien el authenticate, passport deja un req.user, con los datos del usuario
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Login correcto", usuario:req.user});
    }
)



router.get(
    "/logout", 
    (req, res)=>{
    let {web}=req.query
    req.session.destroy(error=>{
        if(error){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`Error al realizar logout`})
        }
        if(web){
            return res.redirect("/login?mensaje=Logout exitoso")
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({payload:"Logout exitoso...!!!"});
        }
    })
})

router.get('/github',
    passport.authenticate("github", {}),    
)

// paso 3
router.get("/callbackGithub2",
    passport.authenticate("github",{failureRedirect:"/api/sessions/error"}),
    (req, res)=>{
        // req.user   generado por el middleware passport si todo sale OK en el authencicate...!!!
        req.session.usuario=req.user
        console.log(`login OK con Passport-Github...!!!`)
        return res.redirect("/products");
        
        //res.setHeader('Content-Type','application/json');
        //return res.status(200).json({payload:"Login exitoso", usuarioLogueado: req.user});
    }
)


// router.post('/registro',async(req,res)=>{
//     let {nombre, email, password, rol}=req.body
//     if(!nombre || !email || !password || !rol){
//         res.setHeader('Content-Type','application/json');
//         return res.status(400).json({error:`Complete los datos...!!!`})
//     }


//     // validaciones x cuenta del alumno
//     try {
//         let existe=await UsuariosManager.getBy({email})
//         if(existe){
//             res.setHeader('Content-Type','application/json');
//             return res.status(400).json({error:`Ya existe un usuario con email ${email}`})
//         }
    
//         password=crypto.createHmac("sha256", config.SECRET).update(password).digest("hex")

//         let nuevoUsuario=await UsuariosManager.create({nombre, email, password, rol})
    
//         res.setHeader('Content-Type','application/json')
//         res.status(201).json({mensaje:"Registro exitoso", nuevoUsuario})

//     } catch (error) {
//         console.log(error);
//         res.setHeader('Content-Type','application/json');
//         return res.status(500).json(
//             {
//                 error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
//                 detalle:`${error.message}`
//             }
//         )
//     }
// })

// router.post("/login", async(req, res)=>{
//     let {email, password}=req.body
//     if(!email || !password){
//         res.setHeader('Content-Type','application/json');
//         return res.status(400).json({error:`Complete datos...!!!`})
//     }
//      try {
//         password=crypto.createHmac("sha256", config.SECRET).update(password).digest("hex")
//         let usuario=await UsuariosManager.getBy({email, password})
//         if(!usuario){
//             res.setHeader('Content-Type','application/json');
//             return res.status(401).json({error:`Credenciales inválidas`})
//         }
//         delete usuario.password // borrar datos sensibles
//         req.session.usuario=usuario
//         res.setHeader('Content-Type','application/json');
//         return res.status(200).json({mensaje:"Login exitoso", usuarioLogueado: usuario});
//     } catch (error) {
//         console.log(error);
//         res.setHeader('Content-Type','application/json');
//         return res.status(500).json(
//             {
//                 error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
//                 detalle:`${error.message}`
//             }
//         )
//     }
// })

// router.get("/logout", (req, res)=>{
//     let {web}=req.query

//     req.session.destroy(error=>{
//         if(error){
//             res.setHeader('Content-Type','application/json');
//             return res.status(500).json({error:`Error al realizar logout`})
//         }
//         if(web){
//             return res.redirect("/login?mensaje=Logout exitoso")
//         }else{
//             res.setHeader('Content-Type','application/json');
//             return res.status(200).json({payload:"Logout exitoso...!!!"});
//         }
//     })
// })
// router.get("/logout", (req, res)=>{
// //     let {web}=req.query

// //     req.session.destroy(error=>{
// //         if(error){
// //             res.setHeader('Content-Type','application/json');
// //             return res.status(500).json({error:`Error al realizar logout`})
// //         }
// //         if(web){
// //             return res.redirect("/login?mensaje=Logout exitoso")
// //         }else{
// //             res.setHeader('Content-Type','application/json');
// //             return res.status(200).json({payload:"Logout exitoso...!!!"});
// //         }
// //     })
// // })




// router.post("/login", passport.authenticate("login", {failureRedirect:"/api/session/error"}), (req, res)=>{

//     req.session.usuario=req.user

//     res.setHeader('Content-Type','application/json');
//     return res.status(200).json({payload:"Login OK", usuarioLogueado: req.user});
// })

// router.get("/logout", (req, res)=>{
//     req.session.destroy(error=>{
//         if(error){
//             res.setHeader('Content-Type','application/json');
//             return res.status(400).json({error:`Error al hacer logout`})
//         }

//         res.setHeader('Content-Type','application/json');
//         return res.status(200).json({payload:"Logout Exitoso...!!!"});
//     })
// })