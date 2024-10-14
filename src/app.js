import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import {engine} from 'express-handlebars';
import sessions from "express-session";
//import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
//import mongoose from 'mongoose';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
//import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';
import { router as productosRouter } from './routes/productosRouter.js';
import { router as sessionsRouter } from './routes/sessionsRouter.js';
import { router as vistasRouter } from './routes/vistas.router.js';
import { connDB } from './ConnDB.js';
import { config } from './config/config.js';
import { initPassport } from './config/passport.config.js';
import passport from 'passport';


const PORT=config.PORT;

const app=express();

//Handlebars Config
app.engine('handlebars', engine());
//app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(express.static("./src/public"))
app.use(express.static('public'));

app.use(sessions({
    secret:config.SECRET_SESSION,
    resave: true, 
    saveUninitialized: true,
    // store: 
}))


initPassport()
app.use(passport.initialize())
app.use(passport.session()) // solo si usamos session

//const uri = 'mongodb://127.0.0.1:27017/entrega-final';
//mongoose.connect(uri);



//app.set('views', __dirname + '/../views');

//Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

app.use("/api/productos", productosRouter)
app.use("/api/sessions", sessionsRouter)
app.use('/', vistasRouter)

//const server=app.listen(PORT,()=>{
//    console.log(`Server escuchando en puerto ${PORT}`);
//});

connDB()
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en Puerto: ${PORT}`);
});

const io = new Server(httpServer);

websocket(io);
