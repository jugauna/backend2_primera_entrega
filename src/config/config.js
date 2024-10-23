// export const config={
//     PORT:3000, 
//     MONGO_URL:"mongodb+srv://jugauna:7MTAZl4YTS95vg8b@cursobackend2.rpsed.mongodb.net/?retryWrites=true&w=majority&appName=CursoBackEnd2",
//     DB_NAME:"dbBackEnd2", 
//     SECRET:"CoderCoder123", 
//     SECRET_SESSION:"CoderCoder123"
// }

import dotenv from 'dotenv';
dotenv.config();

//console.log('Mostrar key:', process.env.SECRET); 

export default {
    SECRET:process.env.SECRET,
    SECRET_SESSION:process.env.SECRET_SESSION,    
    PORT: process.env.PORT, 
    MONGO_URL:process.env.MONGO_URL,
    DB_NAME:process.env.DB_NAME,
    clientID:process.env.clientID,
    clientSecret:process.env.clientSecret,
    callbackURL:process.env.callbackURL,
    //DB_HOST: process.env.DB_HOST,
    //DB_USER: process.env.DB_USER,
    //DB_PASSWORD: process.env.DB_PASSWORD,
    //GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    //GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};

