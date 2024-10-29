import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt"
//import passport from "passport"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const generaHash=password=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
export const validaHash=(pass, hash)=>{
    return bcrypt.compareSync(pass, hash)
}

export default __dirname;

