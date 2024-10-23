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
};

