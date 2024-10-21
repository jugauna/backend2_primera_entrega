import __dirname from './utils.js';
//import { passportCall } from './utils.js';
import path from 'path';
import express from 'express';
import {engine} from 'express-handlebars';
//import sessions from "express-session";
import {Server} from 'socket.io';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import websocket from './websocket.js';
import { router as sessionsRouter } from './routes/sessionsRouter.js';
import { router as vistasRouter } from './routes/vistas.router.js';
import { connDB } from './ConnDB.js';
import { config } from './config/config.js';
import { initPassport } from './config/passport.config.js';
import passport from 'passport';
import cookieParser from "cookie-parser"
//import { isAuthenticated } from '../middleware/auth.js';

const PORT=config.PORT;
const app=express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(express.static('public'));
// app.use(sessions({
//     secret:config.SECRET_SESSION,
//     resave: true, 
//     saveUninitialized: true,
// }))

initPassport()
app.use(passport.initialize())
//app.use(passport.session()) // solo si usamos session

//Routers
//app.use("/api/villanos", passport.authenticate("current", {session:false}), villanosRouter)
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use('/', vistasRouter)


connDB()
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en Puerto: ${PORT}`);
});

const io = new Server(httpServer);

websocket(io);
