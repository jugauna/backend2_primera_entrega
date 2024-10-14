import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import session from 'express-session'
//import connectMongo from 'connect-mongo'
import {engine} from 'express-handlebars';
//import mongoose from 'mongoose';

import { router as sessionsRouter } from './routes/sessionsRouter.js';
import { router as routerVistas} from './routes/views.router.js';
import { config } from './config/config.js';
import { initPassport } from './config/passport.config.js';
import passport from 'passport';


const PORT=config.PORT;

const app=express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')));

// app.use(session({
//     secret: config.SECRET_SESSION,
//     resave:true, saveUninitialized:true,
//     store: connectMongo.create({
//         mongoUrl:config.MONGO_URL,
//         dbName:config.DB_NAME,
//         ttl:3600 
//     })
// }))

// paso 2
initPassport()
app.use(passport.initialize())
app.use(passport.session()) // solo si usamos session

app.use("/api/sessions", sessionsRouter)
app.use('/', routerVistas)


const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});




connDB()
const httpServer = app.listen(PORT, () => {
    console.log(`Start server in PORT ${PORT}`);
});

const io = new Server(httpServer);

websocket(io);