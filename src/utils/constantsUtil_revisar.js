import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bcrypt from "bcrypt"



export default __dirname;



// import {fileURLToPath} from 'url';
// import { dirname } from 'path';
// import bcrypt from "bcrypt"


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// export default __dirname;

export const generaHash=password=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
export const validaHash=(pass, hash)=>bcrypt.compareSync(pass, hash)